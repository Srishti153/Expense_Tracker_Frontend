import React, { useState, useEffect } from 'react';

const Income = () => {
  const [formData, setFormData] = useState({
    id: null, // Add `id` to identify the income being edited
    title: '',
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const categories = [
    'Salary',
    'Freelancing',
    'Investments',
    'Stocks',
    'Bitcoin',
    'Bank Transfer',
    'Other',
  ];

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncomes = async () => {
    try{
      const response = await fetch("http://localhost:8080/api/income/all");
      const result = await response.json();
      setIncomes(result);
      setLoading(false);
      //console.log(result);
    }
    catch(e){
      setError('Failed to load incomes');
      setLoading(false);
      console.log(e);
    }
  }

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    validateForm(updatedFormData);
  };

  const validateForm = (data) => {
    const { title, amount, date, description, category } = data;
    const isValid =
      title.trim().length > 0 &&
      !isNaN(amount) &&
      parseFloat(amount) > 0 &&
      date.trim().length > 0 &&
      description.trim().length > 0 &&
      category.trim().length > 0;

    setIsFormValid(isValid);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/income/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIncomes(incomes.filter((income) => income.id !== id));
      }
    } catch (err) {
      setError("Failed to delete income");
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    const incomeToEdit = incomes.find((income) => income.id === id);
    if (incomeToEdit) {
      setFormData(incomeToEdit); // Pre-fill the form with the income data
      setIsFormValid(true); // Enable the submit button
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If `id` exists, perform an update; otherwise, create a new income
      const url = formData.id
        ? `http://localhost:8080/api/income/${formData.id}`
        : "http://localhost:8080/api/income";
      const method = formData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (formData.id) {
        // Update the income in the state
        setIncomes((prevIncomes) =>
          prevIncomes.map((income) =>
            income.id === formData.id ? result : income
          )
        );
        alert("Income updated successfully!");
      } else {
        // Add the new income to the state
        setIncomes([result, ...incomes]);
        alert("Income submitted successfully!");
      }

      // Reset the form
      setFormData({
        id: null,
        title: "",
        amount: "",
        date: "",
        description: "",
        category: "",
      });
      setIsFormValid(false);
    } catch (error) {
      console.log(error);
      setError("Failed to post income");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', // Center content horizontally
        alignItems: 'center', // Center content vertically
        minHeight: '100vh', // Full screen height
        marginLeft: '250px', // Space for the sidebar
        gap: '20px', // Space between the two cards
      }}
    >
      {/* Income Form */}
      <div
        style={{
          width: '400px', // Consistent width
          height: '500px', // Consistent height
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>{formData.id ? "Edit Income" : "Post New Income"}</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            required
          />
          <textarea
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: '1px solid #ccc',
              resize: 'none',
            }}
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            required
          >
            <option value="" disabled>
              Select the category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              backgroundColor: isFormValid ? '#4CAF50' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
            }}
          >
            {formData.id ? "Update Income" : "Post Income"}
          </button>
        </form>
      </div>
       {/* Past Incomes List */}
       <div
        style={{
          width: '500px', // Consistent width
          height: '500px', // Consistent height
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto', // Scrollable if content exceeds height
        }}
      >
        <h2>Past Incomes</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {incomes.map((income) => (
            <li
              key={income.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '1px solid #ccc',
              }}
            >
              <div>
                <strong>{income.title}</strong> - ${income.amount} -{" "}
                {income.date} - {income.description}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(income.id)}
                  style={{ marginRight: "10px", color: "#4CAF50" }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(income.id)}
                  style={{ color: "#F44336" }}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Income;
