import { useState, useEffect } from "react";

const DateTime = () => {

    const [dateTime, setDateTime] = useState("");

    const generateDateTime = () => {
      const date = new Date();
      const currDate = date.toLocaleDateString("en-GB");
      const currTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const formatedDateTime = `${currDate} - ${currTime}`;

      setDateTime(formatedDateTime);
    };

    useEffect(() => {
      generateDateTime();

      const intervalId = setInterval(() => {
        generateDateTime();
      }, 1000);

      return () => clearInterval(intervalId);
    }, []);

    return (
        <h2 className="date-time">{dateTime}</h2>
    )
}

export default DateTime;