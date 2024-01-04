import {Col, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import React from "react";
import {useNavigate} from "react-router-dom";

interface TimeRangeToggleProps {
    large: boolean;
    defaultValue: string;
}

const TimeRangeToggle: React.FC<TimeRangeToggleProps> = (props) => {
    const navigate = useNavigate();
    const handleTimeRangeButtonOnChange = (buttonValue: string) => {
        navigate({search: `?time_range=${buttonValue}`});
    };

    if (props.large) {
        return (
            <Col className="text-end">
                <ToggleButtonGroup
                    type="radio"
                    name="options"
                    defaultValue={props.defaultValue}
                    onChange={handleTimeRangeButtonOnChange}
                >
                    <ToggleButton id="tbg-radio-1" value="today" size="sm">
                        Today
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value="yesterday" size="sm">
                        Yesterday
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-3" value="all_time" size="sm">
                        All Time
                    </ToggleButton>
                </ToggleButtonGroup>
            </Col>
        );
    } else {
        return;
    }
};

export default TimeRangeToggle;
