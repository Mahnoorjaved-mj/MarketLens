import { Sparkles } from "lucide-react";
import React from "react";

const AiInsight = ({
  title,
  text,
}) => {
  return (
    <div className="ai-insight">

      <div className="ai-icon">
        <Sparkles size={20} />
      </div>

      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>

    </div>
  );
};

export default AiInsight;