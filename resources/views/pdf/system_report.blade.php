<!DOCTYPE html>
<html>
<head>
    <title>System Overview Report</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #333; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 15px; margin-bottom: 25px; }
        .header h1 { margin: 0; font-size: 26px; color: #1e1b4b; }
        .header p { margin: 5px 0 0 0; font-size: 14px; color: #4f46e5; font-weight: bold; text-uppercase: true; }
        .scope-badge { display: inline-block; background-color: #e0e7ff; color: #4338ca; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; margin-top: 10px; }
        
        .stats-grid { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .stats-grid td { width: 25%; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center; }
        .stats-val { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 5px; }
        .stats-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .section-title { font-size: 16px; font-weight: bold; color: #1e293b; margin-bottom: 12px; border-left: 4px solid #6366f1; padding-left: 8px; }
        
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        table.data-table th, table.data-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        table.data-table th { background-color: #f1f5f9; font-weight: bold; color: #475569; font-size: 11px; text-transform: uppercase; }
        table.data-table tr:hover { background-color: #f8fafc; }
        
        .badge { padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .badge-approved { background-color: #d1fae5; color: #065f46; }
        .badge-state { background-color: #e0e7ff; color: #3730a3; }
        .badge-inst { background-color: #dbeafe; color: #1e40af; }
        .badge-submitted { background-color: #fef3c7; color: #92400e; }
        .badge-rejected { background-color: #fee2e2; color: #991b1b; }
        
        .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Cross-State Scholarship System</h1>
        <p>Administrative System Overview Report</p>
        <span class="scope-badge">{{ $scope }}</span>
    </div>

    <table class="stats-grid">
        <tr>
            <td>
                <div class="stats-val">{{ $statesCount }}</div>
                <div class="stats-label">Registered States</div>
            </td>
            <td>
                <div class="stats-val">{{ $verifiedInstitutions->count() }}</div>
                <div class="stats-label">Verified Institutions</div>
            </td>
            <td>
                <div class="stats-val">{{ $activeStudentsCount }}</div>
                <div class="stats-label">Active Students</div>
            </td>
            <td>
                <div class="stats-val" style="color: #db2777;">₹{{ number_format($totalDisbursed, 2) }}</div>
                <div class="stats-label">Total Disbursed</div>
            </td>
        </tr>
    </table>

    <div class="section-title">Verified Educational Institutions</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 10%;">ID</th>
                <th style="width: 45%;">Institution Name</th>
                <th style="width: 25%;">AISHE / Reg Code</th>
                <th style="width: 20%;">State</th>
            </tr>
        </thead>
        <tbody>
            @forelse($verifiedInstitutions as $inst)
            <tr>
                <td>#{{ str_pad($inst->id, 4, '0', STR_PAD_LEFT) }}</td>
                <td style="font-weight: bold; color: #1e293b;">{{ $inst->name }}</td>
                <td><code style="font-family: monospace; font-size: 12px; background-color: #f1f5f9; padding: 2px 4px; border-radius: 3px;">{{ $inst->reg_no }}</code></td>
                <td>{{ $inst->state->name }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="4" style="text-align: center; color: #64748b;">No verified institutions recorded.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div style="page-break-before: always;"></div>

    <div class="section-title">Student Scholarship Applications Ledger</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 10%;">ID</th>
                <th style="width: 25%;">Student & Domicile</th>
                <th style="width: 25%;">Scholarship & College</th>
                <th style="width: 15%;">Performance & Income</th>
                <th style="width: 13%;">Status</th>
                <th style="width: 12%;">Disbursed</th>
            </tr>
        </thead>
        <tbody>
            @forelse($applications as $app)
            <tr>
                <td>#{{ str_pad($app->id, 6, '0', STR_PAD_LEFT) }}</td>
                <td>
                    <div style="font-weight: bold; color: #1e293b;">{{ $app->student->user->name }}</div>
                    <div style="font-size: 10px; color: #64748b;">Home: {{ $app->student->homeState->name }}</div>
                </td>
                <td>
                    <div style="font-weight: bold; color: #4f46e5;">{{ $app->scholarship->title }}</div>
                    <div style="font-size: 10px; color: #64748b;">Inst: {{ $app->institution->name }}</div>
                </td>
                <td>
                    <div style="font-size: 11px;">Marks: <strong>{{ $app->student->marks_percentage }}%</strong></div>
                    <div style="font-size: 10px; color: #059669;">Income: ₹{{ number_format($app->student->annual_income) }}</div>
                </td>
                <td>
                    @if($app->status === 'approved')
                        <span class="badge badge-approved">Approved</span>
                    @elseif($app->status === 'state_verified')
                        <span class="badge badge-state">State Ver.</span>
                    @elseif($app->status === 'institution_verified')
                        <span class="badge badge-inst">Inst. Ver.</span>
                    @elseif($app->status === 'rejected')
                        <span class="badge badge-rejected">Rejected</span>
                    @else
                        <span class="badge badge-submitted">Submitted</span>
                    @endif
                </td>
                <td style="font-weight: bold; text-align: right; color: #1e293b;">
                    ₹{{ number_format($app->scholarship->amount, 2) }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center; color: #64748b;">No applications ledger records found.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>This report is dynamically compiled and contains sensitive institutional and personal student data.</p>
        <p>Generated by Super Administrator on {{ now()->format('F d, Y \a\t h:i A') }}</p>
    </div>
</body>
</html>
