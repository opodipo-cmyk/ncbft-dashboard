# National Contraceptive Basket Fund Tracker (NCBFT) Dashboard

A modern, responsive web-based dashboard for tracking and visualizing family planning commodity financing in Nigeria from 2011 to present.

## Overview

The NCBFT Dashboard transforms Excel-based funding tracking data into an interactive, publicly accessible web application. It provides comprehensive visualization of:
- Funding commitments and disbursements
- Donor contributions and proportions
- Funding gaps and requirements
- Health outcomes (maternal deaths, unsafe abortions, unintended pregnancies)

## Features

### Executive Summary
- **KPI Cards**: Real-time display of key metrics:
  - Funding Requirement (Blue)
  - Funds Disbursed (Green)
  - Funding Gap (Red)
  - Aggregate Funds Disbursed (Gold)

### Interactive Analytics (12 Charts)
1. **Funds Disbursed by Donor by Year** - Grouped Bar Chart
2. **Contribution Proportion by Donor** - Doughnut Chart
3. **Funding Analysis** - Requirement vs Disbursed vs Gap
4. **Funding Trends** - Multi-series line chart across years
5. **Disbursement Rate** - Percentage of commitment disbursed
6. **Funding Commitment by Donor** - Grouped column chart
7. **Funding Requirement Trend** - Column chart by year
8. **Funding Gap Trend** - Line chart by year
9. **Women Receiving Care** - Line chart by year
10. **Unsafe Abortions** - Line chart by year
11. **Unintended Pregnancies** - Line chart by year
12. **Maternal Deaths** - Line chart by year

### Data Management
- **Interactive Data Table**
  - Sortable columns (click header to sort)
  - Search functionality
  - Pagination (10, 25, 50, 100 rows per page)
  - Full record viewing

- **Download Options**
  - Export to Microsoft Excel (.xlsx)
  - Export to CSV (.csv)

### Responsive Design
- Mobile-friendly layout
- Desktop optimization
- Tablet support
- Professional UNFPA-inspired design

## Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js 4.4.0
- **Data Export**: XLSX.js (Excel) & PapaParse (CSV)
- **Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)

## File Structure

```
ncbft-dashboard/
├── index.html          # Main HTML file
├── styles.css          # Styling and responsive design
├── data.js            # Data processing and calculations
├── app.js             # Application logic and charts
└── README.md          # This file
```

## Installation & Deployment

### Local Development
1. Clone or download the repository
2. Open `index.html` in a web browser
3. No server or build process required

### Web Server Deployment
1. Upload all files to your web server
2. Ensure web server serves static files
3. Access via `https://yourdomain.com/`

### GitHub Pages
1. Create a GitHub repository
2. Enable GitHub Pages in repository settings
3. Push files to the repository
4. Access via `https://username.github.io/ncbft-dashboard/`

## Data Source

The application uses embedded CSV data from the official NCBFT dataset containing:
- Donor information
- Funds disbursed and commitments
- Funding requirements
- Procurement modalities
- Health outcome metrics

### Data Columns
- **Donor**: Organization providing funds
- **Year**: Fiscal year (2011-2026)
- **Funds Disbursed**: Amount of funds released ($)
- **Funding Commitment**: Pledged amount ($)
- **Funding Requirement**: Identified need ($)
- **Procurement Modality**: TPP, Co-Financing, In-kind donation
- **Contribution Proportion**: Percentage of total disbursement
- **Women Receiving Care**: Count of beneficiaries
- **Unsafe Abortion**: Incidence count
- **Unintended Pregnancy**: Incidence count
- **Maternal Deaths**: Mortality count

## Calculations & Business Logic

### Funding Gap
```
Funding Gap = Funding Requirement - Total Funds Disbursed
```

### Contribution Proportion
```
Contribution Proportion = (Donor Funds Disbursed / Total Funds Disbursed) × 100%
```

### Disbursement Rate
```
Disbursement Rate = (Funds Disbursed / Funding Commitment) × 100%
```

## Color Scheme

| Element | Color | Hex Code |
|---------|-------|----------|
| Funding Requirement | Blue | #003DA5 |
| Funds Disbursed | Green | #27AE60 |
| Funding Gap | Red | #E74C3C |
| Funding Commitment | Gold | #F39C12 |
| Primary Accent | Dark Blue | #002766 |

## Usage

### Viewing Data
1. **Landing Page**: Scroll down or click "View Dashboard" button
2. **Executive Summary**: Review KPI cards at top
3. **Year Filter**: Select specific year in "Filter by Year" dropdown
4. **Charts**: Click and interact with visualizations
5. **Data Table**: Search, sort, and paginate through records

### Downloading Data
1. Scroll to "Download Dataset" section
2. Click "Download as Excel" or "Download as CSV"
3. File will download to your computer

### Mobile Viewing
- All features work on mobile devices
- Touch-friendly interface
- Responsive layout adapts to screen size

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Fast page load (< 2 seconds typical)
- Responsive interactions
- Optimized chart rendering
- Efficient data filtering and search

## Future Enhancements

- Real-time data integration
- Advanced filtering options
- Comparative donor analysis
- Trend forecasting
- Custom report generation
- API integration for live data

## Maintenance

### Updating Data
The data is embedded in `data.js`. To update:

1. Prepare new CSV data
2. Update the `rawData` variable in `data.js`
3. Ensure column format matches existing structure
4. Test in browser

### Adding New Metrics
1. Add calculation function in `data.js`
2. Create new chart in `app.js`
3. Add chart container to `index.html`
4. Style as needed in `styles.css`

## Support & Contact

For questions or issues with the NCBFT Dashboard, contact:
- **Organization**: Federal Ministry of Health, Nigeria & UNFPA
- **Website**: [UNFPA Nigeria](https://nigeria.unfpa.org)

## License

This dashboard is provided for public use and transparency in family planning commodity financing.

## Acknowledgments

- **Data Source**: Federal Ministry of Health, Nigeria
- **Partner**: United Nations Population Fund (UNFPA)
- **Developed**: Digital Innovation Team

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: Production Ready