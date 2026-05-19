<!DOCTYPE html>
<html>
<head>
    <title>Institution Report - {{ $institution->name }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; color: #1e293b; }
        .content-block { margin-bottom: 20px; }
        .label { font-weight: bold; width: 150px; display: inline-block; }
        .value { display: inline-block; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8fafc; font-weight: bold; color: #475569; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Cross-State Scholarship System</h1>
        <h2>Institution Applications Report</h2>
    </div>

    <div class="content-block">
        <h3>Institution Details</h3>
        <div><span class="label">Name:</span> <span class="value">{{ $institution->name }}</span></div>
        <div><span class="label">Registration No:</span> <span class="value">{{ $institution->reg_no }}</span></div>
        <div><span class="label">State:</span> <span class="value">{{ $institution->state->name }}</span></div>
        <div><span class="label">Status:</span> <span class="value">{{ strtoupper($institution->status) }}</span></div>
    </div>

    <div class="content-block">
        <h3>Applications List</h3>
        <table>
            <thead>
                <tr>
                    <th>App ID</th>
                    <th>Student Name</th>
                    <th>Scholarship</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse($applications as $app)
                <tr>
                    <td>#{{ str_pad($app->id, 6, '0', STR_PAD_LEFT) }}</td>
                    <td>{{ $app->student->user->name }}</td>
                    <td>{{ $app->scholarship->title }}</td>
                    <td>₹{{ number_format($app->scholarship->amount, 2) }}</td>
                    <td>{{ strtoupper($app->status) }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" style="text-align: center;">No applications found for this institution.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>This report is confidential and for administrative use only.</p>
        <p>Generated on {{ now()->format('M d, Y H:i:s') }}</p>
    </div>
</body>
</html>
