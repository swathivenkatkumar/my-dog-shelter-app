import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

/**
 * Login component with a split-screen layout.
 */
const Login: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim() || !email.trim()) {
      setError("Both name and email are required.");
      setLoading(false);
      return;
    }

    try {
      await loginUser(name, email);
      
      navigate("/search");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Error during login:", err);
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-0 vh-100">
      <Row className="g-0 h-100">
        {/* Left column: background image */}
        <Col
          md={6}
          className="d-none d-md-block"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Right column: heading + login form */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column align-items-center justify-content-center p-4"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <h2 className="mb-4 text-center">Welcome to Dog Shelter</h2>
          <Card
            className="shadow"
            style={{ width: "100%", maxWidth: "400px", borderRadius: "0.5rem" }}
          >
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
