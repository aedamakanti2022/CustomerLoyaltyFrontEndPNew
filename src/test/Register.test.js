import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Register from "./Register";

jest.mock("axios");

describe("Register Component", () => {
  it("should render the Register component", () => {
    const { getByText, getByPlaceholderText } = render(<Register />);
    expect(getByText("Welcome to our website!")).toBeInTheDocument();
    expect(getByPlaceholderText("Name")).toBeInTheDocument();
    expect(getByPlaceholderText("Lastname")).toBeInTheDocument();
    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
    expect(getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("should register a user successfully", async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);
    axios.post.mockResolvedValueOnce({ data: {} });

    fireEvent.change(getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(getByPlaceholderText("Lastname"), {
      target: { value: "Doe" },
    });
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(getByPlaceholderText("Confirm Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(getByText("Sign Up"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith("http://localhost:3000/api/v1/register", {
        customerId: expect.any(String),
        username: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      });
      expect(getByText("Registration successfull")).toBeInTheDocument();
    });
  });

  it("should display an error message if passwords don't match", async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);
    axios.post.mockResolvedValueOnce({ data: {} });

    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(getByPlaceholderText("Confirm Password"), {
      target: { value: "password456" }, // Incorrect confirmation password
    });

    fireEvent.click(getByText("Sign Up"));

    await waitFor(() => {
      expect(getByText("Passwords don't match")).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("should display an error message if any input is empty", async () => {
    const { getByText } = render(<Register />);
    axios.post.mockResolvedValueOnce({ data: {} });

    fireEvent.click(getByText("Sign Up"));

    await waitFor(() => {
      expect(getByText("Please fill all inputs")).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
