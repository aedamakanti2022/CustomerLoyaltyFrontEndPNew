import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Login from "./Login";

jest.mock("axios");

describe("Login Component", () => {
  it("should render the Login component", () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    expect(getByText("Welcome back!")).toBeInTheDocument();
    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("should login a user successfully", async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    axios.post.mockResolvedValueOnce({ data: { token: "mockToken" } });

    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(getByText("Log In"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith("http://localhost:3000/api/v1/login", {
        email: "john.doe@example.com",
        password: "password123",
      });
      expect(localStorage.getItem("auth")).toEqual(JSON.stringify("mockToken"));
    });
  });

  it("should display an error message if any input is empty", async () => {
    const { getByText } = render(<Login />);
    axios.post.mockResolvedValueOnce({ data: {} });

    fireEvent.click(getByText("Log In"));

    await waitFor(() => {
      expect(getByText("Please fill all inputs")).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
