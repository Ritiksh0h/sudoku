import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <footer className="fixed bottom-1 left-0 right-0">
      <div className="mt-4 text-center text-muted-foreground/60">
        <p>
          &copy; 2024{" "}
          <Link href={"https://ritikshah.vercel.app"} target="_blank">
            Ritik Shah
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};
