import "./index.css";
import {enc, SHA256} from "crypto-js";
import React, {FormEvent, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import Cookies from "universal-cookie";
import {useLocation, useNavigate} from "react-router-dom";

interface PasswordEntryProps {
    cookieKey: string;
    authToken: string;
}

const PasswordEntry: React.FC<PasswordEntryProps> = (props) => {
    const [formData, setFormData] = useState<{[key: string]: string}>({
        password: ""
    });
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const windowLocation = useLocation();
    const navigate = useNavigate();
    const cookies = new Cookies(null, {path: "/"});

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name in formErrors) {
            const newFormErrors = {...formErrors};
            delete newFormErrors[name];
            setFormErrors(newFormErrors);
        }
    };

    const handlePasswordFormOnSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const passwordHash = SHA256(formData.password).toString(enc.Hex);
        if (props.authToken === passwordHash) {
            cookies.set(props.cookieKey, true);
            navigate({pathname: windowLocation.pathname, search: windowLocation.search});
        } else {
            setFormErrors({password: "Incorrect password, please try again"});
        }
    };

    return (
        <Form
            id="password-entry-form"
            className="d-flex align-items-center"
            onSubmit={handlePasswordFormOnSubmit}
        >
            <Container>
                <Row>
                    <Col xs="12" md={{span: 6, offset: 3}}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                onChange={handleInputChange}
                                isInvalid={"password" in formErrors}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formErrors["password"]}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" md={{span: 6, offset: 3}}>
                        <Button className="w-100" type="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Form>
    );
};

export default PasswordEntry;
