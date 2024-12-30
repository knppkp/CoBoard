import React from "react";

const SignupPage = ({ username, email, password, setUsername, setEmail, setPassword, submitForm, showPassword, toggleShowPassword }) => {
  return (
    <div id="signupInputs" className="flex flex-col items-center mt-10 relative">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-[320px] h-[45px] p-[10px] mb-2.5 border-2 border-[#a2a4a7] font-bold text-[18px] rounded-[16px] placeholder-[#acaeb1]"
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-[320px] h-[45px] p-[10px] mb-2.5 border-2 border-[#a2a4a7] font-bold text-[18px] rounded-[16px] placeholder-[#acaeb1]"
      />
      <div className="relative w-[320px]">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-[320px] h-[45px] p-[10px] mb-2.5 border-2 border-[#a2a4a7] font-bold text-[18px] rounded-[16px] placeholder-[#acaeb1]"
        />
        <button
          onClick={toggleShowPassword}
          className="absolute right-4 top-[23px] transform -translate-y-1/2"
          type="button"
        >
          <img
            src={showPassword ? './asset/opened_eye.svg' : './asset/closed_eye.svg'}
            alt={showPassword ? "Hide Password" : "Show Password"}
            className="h-6 w-6"
          />
        </button>
      </div>

      <button
        className="w-[320px] h-[48px] mt-[20px] p-[10px] rounded-[18px] bg-gradient-to-l flex items-center justify-center from-[#487262] via-[#679f8a] to-[#89d2b6] text-white font-bold text-[25px] tracking-[1px] hover:bg-gradient-to-l hover:from-[#0f1412] hover:via-[#487262] hover:to-[#679f8a]"
        onClick={submitForm}
      >
        Submit
      </button>
    </div>
  );
};

export default SignupPage;
