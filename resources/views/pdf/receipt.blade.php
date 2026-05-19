<!DOCTYPE html>
<html>
<head>
    <title>Application Receipt #{{ $application->id }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; color: #1e293b; }
        .content-block { margin-bottom: 20px; }
        .label { font-weight: bold; width: 150px; display: inline-block; }
        .value { display: inline-block; }
        .status { padding: 5px 10px; border-radius: 4px; font-weight: bold; color: #fff; display: inline-block; margin-top: 10px; }
        .status-pending { background-color: #f59e0b; }
        .status-approved { background-color: #10b981; }
        .status-rejected { background-color: #ef4444; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Cross-State Scholarship System</h1>
        <h2>Application Receipt</h2>
    </div>

    <div class="content-block">
        <h3>Application Details</h3>
        <div><span class="label">Application ID:</span> <span class="value">#{{ str_pad($application->id, 6, '0', STR_PAD_LEFT) }}</span></div>
        <div><span class="label">Date Submitted:</span> <span class="value">{{ $application->created_at->format('M d, Y') }}</span></div>
        <div>
            <span class="label">Current Status:</span> 
            <span class="status status-{{ $application->status }}">{{ strtoupper($application->status) }}</span>
        </div>
    </div>

    <div class="content-block">
        <h3>Student Information</h3>
        <div><span class="label">Name:</span> <span class="value">{{ $application->student->user->name }}</span></div>
        <div><span class="label">Email:</span> <span class="value">{{ $application->student->user->email }}</span></div>
        <div><span class="label">Home State:</span> <span class="value">{{ $application->student->homeState->name }}</span></div>
    </div>

    <div class="content-block">
        <h3>Scholarship Details</h3>
        <div><span class="label">Title:</span> <span class="value">{{ $application->scholarship->title }}</span></div>
        <div><span class="label">Amount:</span> <span class="value">₹{{ number_format($application->scholarship->amount, 2) }}</span></div>
        <div><span class="label">Institution:</span> <span class="value">{{ $application->institution->name }}</span></div>
    </div>

    <div class="footer">
        <p>This is a system-generated receipt and does not require a signature.</p>
        <p>Generated on {{ now()->format('M d, Y H:i:s') }}</p>
    </div>
</body>
</html>
