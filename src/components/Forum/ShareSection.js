import React from 'react';

const ShareSection = React.forwardRef((props, ref) => {
  const currentUrl = window.location.href;

  const shareViaEmail = () => {
    const subject = 'Check out this page!';
    const body = `I found this interesting page: ${currentUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareOnFacebook = () => {
    const currentUrl = window.location.href;
    const bodyText = "Check out this awesome page!";
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php`;
    navigator.clipboard.writeText(currentUrl);
    window.open(facebookUrl, 'width=600,height=400');
  };
  
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check%20this%20out!`;
    window.open(twitterUrl, 'width=600,height=400');
  };

  return (
    <div ref={ref} className="p-2">
      <h1 className="text-white font-bold text-2xl pl-5 -mb-3">Share</h1>
      <div className="w-480 md:w-500 h-fit bg-lightorange mt-4 rounded-2xl py-2 px-10 flex flex-col items-center">
        {/* Email Share */}
        <div
          className="flex w-430 h-20 m-1 rounded-2xl items-center hover:bg-white md:hover:scale-105 transform transition-transform duration-200 cursor-pointer"
          onClick={shareViaEmail}
        >
          <img
            src="/asset/email_icon.svg"
            alt="Share via Email"
            className="flex flex-col  w-10 h-10 ml-8 md:ml-2"
          />
          <p className="text-blackorange text-2xl font-semibold ml-4">Email</p>
        </div>

        <div className="my-1 flex justify-center">
          <div className="w-400 md:w-430 h-0.5 bg-darkorange"></div>
        </div>

        {/* Facebook Share */}
        <div
          className="flex w-430 h-20 m-1 rounded-2xl items-center hover:bg-white md:hover:scale-105 transform transition-transform duration-200 cursor-pointer"
          onClick={shareOnFacebook}
        >
          <img
            src="/asset/facebook_icon.svg"
            alt="Share on Facebook"
            className="flex flex-col  w-10 h-10 ml-8 md:ml-2"
          />
          <p className="text-blackorange text-2xl font-semibold ml-4">Facebook</p>
        </div>

        <div className="my-1 flex justify-center">
          <div className="w-400 md:w-430 h-0.5 bg-darkorange"></div>
        </div>

        {/* Twitter Share */}
        <div
          className="flex w-430 h-20 m-1 rounded-2xl items-center hover:bg-white md:hover:scale-105 transform transition-transform duration-200 cursor-pointer"
          onClick={shareOnTwitter}
        >
          <img
            src="/asset/twitter_icon.svg"
            alt="Share on Twitter"
            className="flex flex-col w-8 h-8 ml-8 md:ml-2"
          />
          <p className="text-blackorange text-2xl font-semibold ml-4">Twitter</p>
        </div>
      </div>
    </div>
  );
});

export default ShareSection;
