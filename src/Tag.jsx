import { FaGithub, FaTwitter } from "react-icons/fa";
import React from "react";

export default function Tag() {
  return (
    <div className="copy">
      <span>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/CantBeFaraz"
        >
          <FaTwitter size={40} />
        </a>
      </span>

      <span>
        Made with 🧡 by{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/CantBeFaraz"
        >
          Faraz Shaikh
        </a>
      </span>

      <span>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/FarazzShaikh"
        >
          <FaGithub size={40} />
        </a>
      </span>
    </div>
  );
}
