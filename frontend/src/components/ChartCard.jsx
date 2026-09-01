const ChartCard = ({
  title,
  subtitle,
  children,
  className = "",
}) => {
  return (
    <div className={`report-card ${className}`}>

      <div className="report-card-header">

        <div>
          <h3>{title}</h3>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>

        <button className="chart-menu">
          •••
        </button>

      </div>

      <div className="chart-content">
        {children}
      </div>

    </div>
  );
};

export default ChartCard;