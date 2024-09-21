import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSignup } from '../../context/SignupContext';

const CreateAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasSignedUp } = useSignup(); 

  useEffect(() => {
    if (!hasSignedUp) {
      navigate('/signup');
    }
  }, [hasSignedUp, navigate]);

  // Rest of your CreateAccount logic (for example form handling)
  const { email, password } = location.state || {};

  const [fname, setFname] = useState('');
  const [mname, setMname] = useState('');
  const [sname, setSname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ppsno, setPpsno] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [taxStatus, setTaxStatus] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [occupation, setOccupation] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !fname || 
        !sname || 
        !phoneNumber || 
        !dateOfBirth || 
        !ppsno || 
        !addressLine1 || 
        !city || 
        !country || 
        !taxStatus || 
        !maritalStatus || 
        !occupation || 
        !currency ||
        image === null
      ) {
        alert("Please fill in all required fields.");
        return;
      }

    const currentTimestamp = new Date().toISOString();

    const formData = new FormData();
    formData.append('fname', fname);
    formData.append('mname', mname);
    formData.append('sname', sname);
    formData.append('email', email);
    formData.append('phone_number', phoneNumber);
    formData.append('date_of_birth', dateOfBirth);
    formData.append('ppsno', ppsno);
    formData.append('address_line1', addressLine1);
    formData.append('address_line2', addressLine2);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('country', country);
    formData.append('tax_status', taxStatus);
    formData.append('marital_status', maritalStatus);
    formData.append('postal_code', postalCode);
    formData.append('occupation', occupation);
    formData.append('currency', currency);
    formData.append('password', password);
    formData.append('role', 'client');
    formData.append('subscription_level', 'free');
    formData.append('account_status', 'active');
    formData.append('last_login', '');
    formData.append('is_auto_renew', true);
    formData.append('payment_method', '');
    formData.append('renewal_date', currentTimestamp);
    
    if (image) {
      formData.append('image', image);
    }
    console.log('Form data:', formData);
    // try {
    //   const response = await fetch('/api/create-account', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   const result = await response.json();
    //   console.log('Account created successfully:', result);
    navigate('/login');
    // } catch (error) {
    //   console.error('Error creating account:', error);
    // }
  };

  return (
    <main>
      <header>
        <h1>Create Account</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fname"><span className="required">*</span> First Name:</label>
        <input
          type="text"
          id="fname"
          placeholder="First Name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
        />

        <label htmlFor="mname">Middle Name:</label>
        <input
          type="text"
          id="mname"
          placeholder="Middle Name"
          value={mname}
          onChange={(e) => setMname(e.target.value)}
        />

        <label htmlFor="sname"><span className="required">*</span> Surname:</label>
        <input
          type="text"
          id="sname"
          placeholder="Surname"
          value={sname}
          onChange={(e) => setSname(e.target.value)}
          required
        />

        <label htmlFor="phoneNumber"><span className="required">*</span> Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <label htmlFor="dateOfBirth"><span className="required">*</span> Date of Birth:</label>
        <input
          type="date"
          id="dateOfBirth"
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />

        <label htmlFor="ppsno"><span className="required">*</span> Government ID Number (e.g. PPSNO):</label>
        <input
          type="text"
          id="ppsno"
          placeholder="ID Number"
          value={ppsno}
          onChange={(e) => setPpsno(e.target.value)}
          required
        />

        <label htmlFor="addressLine1"><span className="required">*</span> Address Line 1:</label>
        <input
          type="text"
          id="addressLine1"
          placeholder="Address Line 1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          required
        />

        <label htmlFor="addressLine2"> Address Line 2:</label>
        <input
          type="text"
          id="addressLine2"
          placeholder="Address Line 2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
        />

        <label htmlFor="city"><span className="required">*</span> City:</label>
        <input
          type="text"
          id="city"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <label htmlFor="state">State:</label>
        <input
          type="text"
          id="state"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

        <label htmlFor="country"><span className="required">*</span> Country:</label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          <option value="" disabled>Select Country</option>
          <option value="Ireland">Ireland</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Canada">Canada</option>
          <option value="Japan">Japan</option>
        </select>

        <label htmlFor="postalCode">Postal Code:</label>
        <input
          type="text"
          id="postalCode"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <label htmlFor="taxStatus"><span className="required">*</span> Tax Status:</label>
        <select
          id="taxStatus"
          value={taxStatus}
          onChange={(e) => setTaxStatus(e.target.value)}
          required
        >
          <option value="" disabled>Select Tax Status</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-Employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="student">Student</option>
          <option value="retired">Retired</option>
        </select>

        <label htmlFor="maritalStatus"><span className="required">*</span> Marital Status:</label>
        <select
          id="maritalStatus"
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          required
        >
          <option value="" disabled>Select Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>

        <label htmlFor="occupation"><span className="required">*</span> Occupation:</label>
        <input
          type="text"
          id="occupation"
          placeholder="Occupation"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          required
        />

        <label htmlFor="currency"><span className="required">*</span> Currency:</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>

        <div className="custom-file-upload-wrapper">
        <label className={`custom-file-upload ${imageName ? 'uploaded' : ''}`}>
        <span className="required">*</span> {imageName ? 'Image Uploaded! Change ID Image?' : 'Upload ID Image'}
            <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
            />
            </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default CreateAccount;
