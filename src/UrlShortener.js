import React, { useEffect, useState } from "react";

const isValidUrl = (url) => {
  const urlPattern = new RegExp(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i);

  return urlPattern.test(url);
};

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(null);

  const [error, setError] = useState(false);

  const [customTitle, setCustomTitle] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const shorten = async (url) => {
    const endpoint = "https://api.rebrandly.com/v1/links";
    const linkRequest = {
      destination: url,
      domain: { fullName: "rebrand.ly" },
      slashtag: customTag,
      title: customTitle,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.REACT_APP_REBRANDLY_API_KEY,
          //   "workspace": "YOUR_WORKSPACE_ID"
        },
        body: JSON.stringify(linkRequest),
      });

      const link = await response.json();

      if (link?.code === "InvalidFormat") {
        setErrMsg(link.errors[0].message);
      } else {
        setShortUrl(link);
        setErrMsg("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerateURL = () => {
    if (url !== "" && isValidUrl(url)) {
      setError(false);
      const urlToShorten = url;
      shorten(urlToShorten);
    } else {
      setError(true);
    }
  };

  return (
    <div className="container-div">
      <div className="container">
        <h1>Link Shortener</h1>
        <div className="input-form">
          <input
            className="form-control"
            type="text"
            placeholder="Enter URL to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            className="form-control"
            type="text"
            placeholder="Enter custom title"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
          <input
            className="form-control"
            type="text"
            placeholder="Enter custom tag"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
          />
          {error && <p className="text-danger">Enter valid URL</p>}
          <button className="btn btn-primary" onClick={handleGenerateURL}>
            Shorten URL
          </button>
        </div>
        <div className="short-url">
          {errMsg !== ""
            ? errMsg
            : shortUrl && (
                <div className="url-div">
                  This is your generated short url <br /> {shortUrl?.shortUrl}
                  <br />
                  <p>
                    {" "}
                    Title: <span> {shortUrl?.title}</span>
                  </p>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default UrlShortener;
