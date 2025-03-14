import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import "./BuyMovie.scss";
import { type } from "@testing-library/user-event/dist/type";

const BuyMovie = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [showTimes, setShowTimes] = useState([
    "10:00",
    "12:30",
    "15:00",
    "17:30",
    "20:00",
    "22:30",
  ]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    poster: "",
    title: "",
    type: "",
    email: "",
    paymentMethod: "creditCard",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    paypalEmail: "",
    date: "",
    time: "",
    seats: [],
    totalPrice: 29,
  });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/watchlist/${movieId}`
        );
        setMovie(response.data);
        setFormData((prevData) => ({
          ...prevData,
          poster: response.data.poster,
          title: response.data.title,
          type: response.data.type,
        }));
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user_boutique"));
      if (storedUser) {
        try {
          const response = await axios.get("http://localhost:3001/Users");
          const user = response.data.find(
            (user) => user.username === storedUser.username
          );
          if (user) {
            setFormData((prevData) => ({
              ...prevData,
              userId: user.id,
              username: user.username,
              email: user.email,
            }));
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchMovie();
    fetchUser();
  }, [movieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSeatClick = (seatId) => {
    const updatedSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter((id) => id !== seatId)
      : [...selectedSeats, seatId];

    setSelectedSeats(updatedSeats);
    setFormData((prev) => ({
      ...prev,
      seats: updatedSeats,
      totalPrice: updatedSeats.length * 12.99, // $12.99 per seat
    }));
  };

  const generatePDF = async () => {
    // Create a ticket-styled PDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [210, 100],
    });

    // Set background color
    doc.setFillColor(35, 47, 62);
    doc.rect(0, 0, 210, 100, "F");

    // Add ticket border
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 90, "S");

    // Add perforated line
    doc.setDrawColor(255, 215, 0);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(150, 5, 150, 95);

    // Reset line style
    doc.setLineDashPattern([], 0);

    // Add cinema logo/header
    doc.setTextColor(255, 215, 0);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("CINEMA TICKET", 45, 15);

    // Add movie info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${movie.title}`, 10, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${formData.date}`, 10, 35);
    doc.text(`Time: ${formData.time}`, 10, 42);
    doc.text(`Seats: ${formData.seats.join(", ")}`, 10, 49);
    doc.text(`Price: $${formData.totalPrice.toFixed(2)}`, 10, 56);

    // Add user info
    doc.setFontSize(10);
    doc.text(`Customer: ${formData.username}`, 10, 65);
    doc.text(`Email: ${formData.email}`, 10, 72);
    doc.text(`Purchase ID: ${Date.now().toString().slice(-8)}`, 10, 79);

    // Add small print
    doc.setFontSize(6);
    doc.text(
      "No refunds. Present this ticket at the entrance 15 minutes before showtime.",
      10,
      90
    );

    // Add QR code on the stub
    const qrData = `Movie: ${movie.title}\nDate: ${formData.date}\nTime: ${
      formData.time
    }\nSeats: ${formData.seats.join(", ")}\nUser: ${formData.username}`;
    const qrCode = await QRCode.toDataURL(qrData);
    doc.addImage(qrCode, "JPEG", 155, 20, 45, 45);

    // Add stub text
    doc.setFontSize(10);
    doc.setTextColor(255, 215, 0);
    doc.text("SCAN AT ENTRANCE", 160, 75);

    doc.save("movie_ticket.pdf");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }

    setError("");
    try {
      await axios.post("http://localhost:3001/purchases", {
        movieId,
        poster: formData.poster,
        title: formData.title,
        type: formData.type,
        ...formData,
      });
      console.log(formData);

      alert("Purchase successful! Your ticket is downloading.");
      generatePDF();
    } catch (error) {
      console.error("Error processing purchase:", error);
      setError("Failed to process purchase.");
    }
  };

  // Generate seat grid: 8 rows (A-H) with 10 seats each
  const renderSeats = () => {
    const rows = ["A", "B", "C", "D"];
    return (
      <div className="seating-plan">
        <div className="screen">
          <div className="screen-text">SCREEN</div>
        </div>
        <div className="seat-container">
          {rows.map((row) => (
            <div key={row} className="seat-row">
              <div className="row-label">{row}</div>
              {[...Array(10)].map((_, i) => {
                const seatId = `${row}${i + 1}`;
                return (
                  <div
                    key={seatId}
                    className={`seat ${
                      selectedSeats.includes(seatId) ? "selected" : ""
                    }`}
                    onClick={() => handleSeatClick(seatId)}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat selected"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="buy-movie">
      {movie && (
        <div className="movie-info">
          <img src={movie.poster} alt={movie.title} />
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="purchase-form">
        <div className="reservation-heading">
          <h2>Movie Reservation</h2>
          {formData.totalPrice > 0 && (
            <div className="price-display">
              Total: ${formData.totalPrice.toFixed(2)}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Time</label>
          <div className="showtime-buttons">
            {showTimes.map((time) => (
              <button
                key={time}
                type="button"
                className={`showtime-btn ${
                  formData.time === time ? "active" : ""
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, time }))}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {formData.date && formData.time && (
          <div className="form-group">
            <label>Select Seats</label>
            {renderSeats()}
          </div>
        )}

        <div className="form-group">
          <label>Your Information</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            readOnly
            className="user-info"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="user-info"
          />
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <div className="payment-options">
            <div
              className={`payment-option ${
                formData.paymentMethod === "creditCard" ? "active" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMethod: "creditCard",
                }))
              }
            >
              <span>Credit Card</span>
            </div>
            <div
              className={`payment-option ${
                formData.paymentMethod === "paypal" ? "active" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, paymentMethod: "paypal" }))
              }
            >
              <span>PayPal</span>
            </div>
          </div>
        </div>

        {formData.paymentMethod === "creditCard" && (
          <>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVC</label>
                <input
                  type="text"
                  name="cardCVC"
                  value={formData.cardCVC}
                  onChange={handleChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </>
        )}

        {formData.paymentMethod === "paypal" && (
          <div className="form-group">
            <label>PayPal Email</label>
            <input
              type="email"
              name="paypalEmail"
              value={formData.paypalEmail}
              onChange={handleChange}
              placeholder="your-email@example.com"
              required
            />
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <button
          type="submit"
          className="buy-button"
          disabled={selectedSeats.length === 0}
        >
          Buy Ticket{selectedSeats.length > 1 ? "s" : ""}
        </button>
      </form>
    </div>
  );
};

export default BuyMovie;
