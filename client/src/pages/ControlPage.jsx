// client/src/pages/ControlPage.jsx

import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import "../App.css"; // Optional: for button styling

const applianceList = ["HOUSE", "Bedroom light", "TV socket", "Shower", "Cooker"];

const ControlPage = () => {
    const [applianceStates, setApplianceStates] = useState({});

    // Load appliance states from Firebase
    useEffect(() => {
        const statesRef = ref(database, "applianceStates");

        onValue(statesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setApplianceStates(data);
            }
        });
    }, []);

    const toggleAppliance = (name) => {
        const newState = !applianceStates[name];

        // Update Firebase
        const applianceRef = ref(database, `applianceStates/${name}`);
        set(applianceRef, newState);

        // Optional: update UI immediately
        setApplianceStates((prev) => ({
            ...prev,
            [name]: newState,
        }));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Remote Appliance Control</h2>
            <div
                style={{
                    display: "grid",
                    gap: "1rem",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    marginTop: "2rem",
                }}
            >
                {applianceList.map((appliance) => (
                    <button
                        key={appliance}
                        onClick={() => toggleAppliance(appliance)}
                        style={{
                            padding: "1rem",
                            backgroundColor: applianceStates[appliance] ? "green" : "red",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                    >
                        {appliance.toUpperCase()}: {applianceStates[appliance] ? "ON" : "OFF"}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ControlPage;
