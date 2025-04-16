import requests
from datetime import datetime
from collections import defaultdict
import os

# GitHub Config
repo_owner = os.getenv("GitHub_Repo_Owner")  
repo_name = os.getenv("GitHub_Repo_Name")           
github_token = os.getenv("Github_PR_Auth")  

if not github_token:
    raise ValueError("GitHub Token not set")

base_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}"

def get_headers():
    return {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {github_token}"
    }

output_date_format = "%d-%m-%Y %H:%M"

def parse_iso_datetime(timestamp_str):
    """Parse ISO datetime string from GitHub"""
    if not timestamp_str:
        return None
    try:
        return datetime.strptime(timestamp_str, "%Y-%m-%dT%H:%M:%SZ")
    except ValueError:
        try:
            return datetime.strptime(timestamp_str, "%Y-%m-%dT%H:%M:%S+00:00")
        except Exception as e:
            print(f"Error parsing datetime {timestamp_str}: {str(e)}")
            return None

def fetch_branch_creation_time(branch_name):
    """Fetch the creation date of a branch from GitHub"""
    if not branch_name:
        return None
        
    url = f"{base_url}/branches/{branch_name}"
    try:
        res = requests.get(url, headers=get_headers(), timeout=15)
        res.raise_for_status()
        commit_sha = res.json().get("commit", {}).get("sha")
        if not commit_sha:
            return None
            
        # Get the commit details to get the commit date
        commit_url = f"{base_url}/commits/{commit_sha}"
        commit_res = requests.get(commit_url, headers=get_headers(), timeout=15)
        commit_res.raise_for_status()
        commit_data = commit_res.json()
        commit_date = commit_data.get("commit", {}).get("author", {}).get("date")
        return parse_iso_datetime(commit_date)
    except Exception as e:
        print(f"Error fetching branch creation for {branch_name}: {str(e)}")
        return None

def fetch_prs():
    """Fetch all closed pull requests with pagination"""
    url = f"{base_url}/pulls?state=closed&per_page=100"  # Max per page is 100
    all_prs = []
    max_prs = 500  # Safety limit
    attempts = 0
    
    while url and attempts < 10 and len(all_prs) < max_prs:
        attempts += 1
        try:
            res = requests.get(url, headers=get_headers(), timeout=30)
            res.raise_for_status()
            all_prs.extend(res.json())
            
            # Handle pagination
            if "next" in res.links:
                url = res.links["next"]["url"]
            else:
                url = None
        except Exception as e:
            print(f"Error fetching PRs (attempt {attempts}): {str(e)}")
            break

    print(f"Total PRs fetched: {len(all_prs)}")
    return all_prs

def fetch_review_comments(pr_number):
    """Count review comments for a PR"""
    if not pr_number:
        return 0
        
    url = f"{base_url}/pulls/{pr_number}/reviews"
    try:
        res = requests.get(url, headers=get_headers(), timeout=15)
        res.raise_for_status()
        reviews = res.json()
        return len([r for r in reviews if r.get("state") != "PENDING"])
    except Exception as e:
        print(f"Error fetching reviews for PR {pr_number}: {str(e)}")
        return 0

def fetch_commit_count(pr_number):
    """Count commits in a PR"""
    if not pr_number:
        return 0
        
    url = f"{base_url}/pulls/{pr_number}/commits"
    try:
        res = requests.get(url, headers=get_headers(), timeout=15)
        res.raise_for_status()
        commits = res.json()
        return len(commits)
    except Exception as e:
        print(f"Error fetching commits for PR {pr_number}: {str(e)}")
        return 0

def calculate_metrics(pr_data):
    """Calculate all metrics with robust error handling"""
    if not pr_data:
        return {}, {}
        
    metrics = {
        "Total PRs": 0,
        "PRs Merged in 1 Hour": 0,
        "PRs Merged in 1-5 Hours": 0,
        "PRs Merged in More than 5 Hours": 0,
        "PRs with Less than 5 Comments": 0,
        "PRs with 5-10 Comments": 0,
        "PRs with More than 10 Comments": 0,
        "Average Branch-to-PR Time (hrs)": 0,
        "Average Merge Time (hrs)": 0,
        "Valid PRs Processed": 0
    }

    branch_first_pr = defaultdict(list)
    merge_times = []
    valid_prs = []
    
    for pr in pr_data:
        if not all(key in pr for key in ["Merge Time (hrs)", "Review Comments", "Created Datetime"]):
            continue
            
        try:
            # Basic metrics
            merge_time = float(pr["Merge Time (hrs)"])
            review_comments = int(pr["Review Comments"])
            
            # Categorize by merge time
            if merge_time < 1:
                metrics["PRs Merged in 1 Hour"] += 1
            elif 1 <= merge_time < 5:
                metrics["PRs Merged in 1-5 Hours"] += 1
            else:
                metrics["PRs Merged in More than 5 Hours"] += 1
            
            # Categorize by comments
            if review_comments < 5:
                metrics["PRs with Less than 5 Comments"] += 1
            elif 5 <= review_comments <= 10:
                metrics["PRs with 5-10 Comments"] += 1
            else:
                metrics["PRs with More than 10 Comments"] += 1
            
            merge_times.append(merge_time)
            valid_prs.append(pr)
            
            # Track first PR for each branch
            branch_name = pr.get("Branch", "")
            created_dt = pr.get("Created Datetime")
            if branch_name and created_dt:
                branch_first_pr[branch_name].append({
                    "pr_date": created_dt,
                    "pr_number": pr["PR Number"],
                    "pr_title": pr["PR Title"]
                })
                
        except Exception as e:
            print(f"Error processing PR metrics: {str(e)}")
            continue
    
    # Calculate averages
    metrics["Total PRs"] = len(pr_data)
    metrics["Valid PRs Processed"] = len(valid_prs)
    
    if merge_times:
        metrics["Average Merge Time (hrs)"] = round(sum(merge_times) / len(merge_times), 2)
    
    # Calculate branch-to-PR times
    branch_creation_times = {}
    valid_branches = 0
    total_branch_pr_time = 0
    
    for branch_name, prs in branch_first_pr.items():
        if not prs:
            continue
            
        try:
            earliest_pr = min(prs, key=lambda x: x["pr_date"])
            branch_creation_time = fetch_branch_creation_time(branch_name)
            
            if branch_creation_time and earliest_pr["pr_date"]:
                time_diff = (earliest_pr["pr_date"] - branch_creation_time).total_seconds() / 3600
                total_branch_pr_time += time_diff
                valid_branches += 1
                
                branch_creation_times[branch_name] = {
                    "creation_time": branch_creation_time.strftime(output_date_format),
                    "first_pr_time": earliest_pr["pr_date"].strftime(output_date_format),
                    "time_diff_hrs": round(time_diff, 2),
                    "first_pr_number": earliest_pr["pr_number"],
                    "first_pr_title": earliest_pr["pr_title"]
                }
        except Exception as e:
            print(f"Error processing branch {branch_name}: {str(e)}")
            continue
    
    if valid_branches > 0:
        metrics["Average Branch-to-PR Time (hrs)"] = round(total_branch_pr_time / valid_branches, 2)
    
    return metrics, branch_creation_times

def generate_html_report(pr_data, metrics, branch_creation_times):
    """Generate comprehensive HTML report"""
    html_content = f"""
    <html>
    <head>
        <title>GitHub PR Analysis Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            h1, h2 {{ text-align: center; color: #333; }}
            .summary {{ background-color: #f8f9fa; padding: 20px; border-radius: 5px; }}
            table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #4CAF50; color: white; }}
            .summary-table th {{ background-color: #333; }}
            .branch-table th {{ background-color: #2c3e50; }}
            tr:nth-child(even) {{ background-color: #f2f2f2; }}
            .metric-value {{ font-weight: bold; color: #2196F3; }}
            .warning {{ color: #ff9800; font-weight: bold; }}
        </style>
    </head>
    <body>
        <h1>GitHub Pull Request Analysis</h1>
        <h2>Repository: {repo_name}</h2>
        
        <div class="summary">
            <h2>Summary Metrics</h2>
            <table class="summary-table">
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Total PRs Analyzed</td><td class="metric-value">{metrics["Total PRs"]}</td></tr>
                <tr><td>Valid PRs Processed</td><td class="metric-value">{metrics["Valid PRs Processed"]}</td></tr>
                <tr><td>Average PR Completion Time</td><td class="metric-value">{metrics["Average Merge Time (hrs)"]} hours</td></tr>
                <tr><td>Average Task Completion Time</td><td class="metric-value">{metrics["Average Branch-to-PR Time (hrs)"]} hours</td></tr>
                <tr><td colspan="2"><strong>PR Processing/Completion Timeline</strong></td></tr>
                <tr><td>Total PRs Completed/Merged in Less than 1 Hour</td><td>{metrics["PRs Merged in 1 Hour"]}</td></tr>
                <tr><td>Total PRs Completed/Merged in between 1 to 5 Hours</td><td>{metrics["PRs Merged in 1-5 Hours"]}</td></tr>
                <tr><td>Total PRs Completed/Merged in More than 5 Hours</td><td>{metrics["PRs Merged in More than 5 Hours"]}</td></tr>
                <tr><td colspan="2"><strong>Review Activity</strong></td></tr>
                <tr><td>Total PRs with Less than 5 Review Comments</td><td>{metrics["PRs with Less than 5 Comments"]}</td></tr>
                <tr><td>Total PRs with 5 to 10 Review Comments</td><td>{metrics["PRs with 5-10 Comments"]}</td></tr>
                <tr><td>Total PRs with More than 10 Review Comments</td><td>{metrics["PRs with More than 10 Comments"]}</td></tr>
            </table>
        </div>

        <h2>Detailed Task Completion Timeline</h2>
        {f'<p class="warning">Note: Only showing branches where creation time could be determined</p>' if len(branch_creation_times) < metrics["Valid PRs Processed"] else ''}
        <table class="branch-table">
            <tr>
                <th>Branch</th>
                <th>Creation Time</th>
                <th>Task Completion(PR Raised)</th>
                <th>PR Number</th>
                <th>PR Title</th>
                <th>Total Completion Time</th>
            </tr>
    """
    
    # Sort branches by time difference
    sorted_branches = sorted(branch_creation_times.items(), 
                           key=lambda x: x[1]["time_diff_hrs"])
    
    for branch_name, data in sorted_branches:
        html_content += f"""
            <tr>
                <td>{branch_name}</td>
                <td>{data["creation_time"]}</td>
                <td>{data["first_pr_time"]}</td>
                <td>{data["first_pr_number"]}</td>
                <td>{data["first_pr_title"]}</td>
                <td>{data["time_diff_hrs"]} hours</td>
            </tr>
        """
    
    html_content += """
        </table>

        <h2>All Pull Requests</h2>
        <table>
            <tr>
                <th>PR #</th>
                <th>Title</th>
                <th>Branch</th>
                <th>Created On</th>
                <th>Merged On</th>
                <th>Author</th>
                <th>Completion Time</th>
                <th>Review Comments</th>
                <th>Total Commits</th>
            </tr>
    """
    
    # Sort PRs by creation date
    sorted_prs = sorted(
        [pr for pr in pr_data if pr.get("Created Datetime")], 
        key=lambda x: x["Created Datetime"]
    )
    
    for pr in sorted_prs:
        html_content += f"""
            <tr>
                <td>{pr["PR Number"]}</td>
                <td>{pr["PR Title"]}</td>
                <td>{pr["Branch"]}</td>
                <td>{pr["Created on"]}</td>
                <td>{pr["Merged on"]}</td>
                <td>{pr["User"]}</td>
                <td>{pr["Merge Time (hrs)"]} hrs</td>
                <td>{pr["Review Comments"]}</td>
                <td>{pr["Commit Count"]}</td>
            </tr>
        """

    html_content += """
        </table>
    </body>
    </html>
    """

    # Create Reports directory if it doesn't exist
    os.makedirs("Reports/PR_Analysis", exist_ok=True)
    
    with open("Reports/PR_Analysis/pr_analysis_report.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    print("Successfully generated report: pr_analysis_report.html")

def main():
    print("Starting PR analysis...")
    
    # Fetch all PRs
    prs = fetch_prs()
    if not prs:
        print("No PRs found or error fetching PRs")
        return
    
    # Process each PR
    final_dataset = []
    for pr in prs:
        try:
            # Skip PRs that weren't merged (just closed)
            if not pr.get("merged_at"):
                continue
                
            created_at = parse_iso_datetime(pr.get("created_at", ""))
            merged_at = parse_iso_datetime(pr.get("merged_at", ""))
            
            if not created_at or not merged_at:
                print(f"Skipping PR {pr.get('number')} due to invalid dates")
                continue
                
            pr_number = pr["number"]
            review_comments = fetch_review_comments(pr_number)
            commit_count = fetch_commit_count(pr_number)
            merge_time_hrs = (merged_at - created_at).total_seconds() / 3600
            
            final_dataset.append({
                "PR Number": pr_number,
                "PR Title": pr.get("title", "No title"),
                "Branch": pr.get("head", {}).get("ref", "").split("/")[-1],
                "Created on": created_at.strftime(output_date_format),
                "Created Datetime": created_at,
                "Merged on": merged_at.strftime(output_date_format),
                "User": pr.get("user", {}).get("login", "Unknown"),
                "Merge Time (hrs)": round(merge_time_hrs, 2),
                "Review Comments": review_comments,
                "Commit Count": commit_count
            })
        except Exception as e:
            print(f"Error processing PR {pr.get('number')}: {str(e)}")
            continue
    
    if not final_dataset:
        print("No valid PRs processed - cannot generate report")
        return
    
    # Calculate metrics and generate report
    metrics, branch_creation_times = calculate_metrics(final_dataset)
    generate_html_report(final_dataset, metrics, branch_creation_times)
    
    print("Analysis completed successfully")

if __name__ == "__main__":
    main()
