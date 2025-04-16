import json
from datetime import datetime

# Load Gitleaks JSON report
with open("gitleaks-report.json", "r") as file:
    data = json.load(file)

# Extract summary details
total_issues = len(data)
unique_commits = set(leak["Commit"] for leak in data)
unique_files = set(leak["File"] for leak in data)
unique_authors = set(leak["Email"] for leak in data if leak.get("Email"))

# Extract commit timestamps to determine scan period
commit_dates = [leak["Date"] for leak in data if "Date" in leak]
if commit_dates:
    commit_dates = sorted(commit_dates, key=lambda x: datetime.fromisoformat(x.rstrip("Z")))
    first_commit_date = commit_dates[0]
    last_commit_date = commit_dates[-1]
else:
    first_commit_date = last_commit_date = "N/A"

# HTML structure with official Gitleaks styling
html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gitleaks Security Report</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }}
        .container {{
            width: 90%;
            margin: 20px auto;
            background: white;
            padding: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow-x: auto;
        }}
        h1 {{
            text-align: center;
            color: #dc3545;
        }}
        h3 {{
            background: #007bff;
            color: white;
            padding: 10px;
            border-radius: 4px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            table-layout: fixed;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
            word-wrap: break-word;
            overflow: hidden;
        }}
        th {{
            background-color: #dc3545;
            color: white;
        }}
        .summary-table td {{
            font-weight: bold;
            background-color: #f8f9fa;
        }}
        .secret {{
            font-family: monospace;
            color: red;
        }}
        pre {{
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-x: auto;
        }}
    </style>
</head>
<body>

<div class="container">
    <h1> Gitleaks Security Report</h1>

    <h3>📝 Summary</h3>
    <table class="summary-table">
        <tr><td>Total Issues Found</td><td>{total_issues}</td></tr>
        <tr><td>Unique Commits Scanned</td><td>{len(unique_commits)}</td></tr>
        <tr><td>Total Files Scanned</td><td>{len(unique_files)}</td></tr>
        <tr><td>Unique Authors (by Email)</td><td>{len(unique_authors)}</td></tr>
        <tr><td>Scan Period</td><td>{first_commit_date} to {last_commit_date}</td></tr>
    </table>

    <h3>🔎 Detected Secrets</h3>
    <div style="overflow-x: auto;">
        <table>
            <tr>
                <th>Rule ID</th>
                <th>Description</th>
                <th>File</th>
                <th>Line</th>
                <th>Secret</th>
                <th>Commit</th>
                <th>Email</th>
                <th>Date</th>
                <th>Message</th>
            </tr>
"""

# Loop through detected leaks
for leak in data:
    html_content += f"""
            <tr>
                <td>{leak.get("RuleID", "N/A")}</td>
                <td>{leak.get("Description", "N/A")}</td>
                <td>{leak.get("File", "N/A")}</td>
                <td>{leak.get("StartLine", "N/A")}</td>
                <td class="secret"><pre>{leak.get("Match", "N/A")}</pre></td>
                <td>{leak.get("Commit", "N/A")}</td>
                <td>{leak.get("Email", "N/A")}</td>
                <td>{leak.get("Date", "N/A")}</td>
                <td>{leak.get("Message", "N/A")}</td>
            </tr>
    """

html_content += """
        </table>
    </div>
</div>

</body>
</html>
"""

# Save as HTML file
with open("Reports/Gitleaks/gitleaks-analysis-report.html", "w") as file:
    file.write(html_content)

print("✅ Gitleaks HTML report generated: gitleaks-report.html")
