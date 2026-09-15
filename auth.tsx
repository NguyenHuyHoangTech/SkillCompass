"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  Compass,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

export type DemoSession = {
  email: string;
  displayName: string;
};

const storageKey = "skillpath-demo-session";
const sessionEvent = "skillpath-session-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(sessionEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(sessionEvent, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(storageKey) ?? "";
}

function getServerSnapshot() {
  return "";
}

function parseSession(raw: string): DemoSession | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      value &&
      typeof (value as DemoSession).email === "string" &&
      typeof (value as DemoSession).displayName === "string"
    )
      return value as DemoSession;
  } catch {
    return null;
  }
  return null;
}

export function useDemoAuth() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const session = parseSession(raw);
  function login(email: string) {
    const normalizedEmail = email.trim().toLocaleLowerCase("vi");
    const prefix = normalizedEmail.split("@")[0] || "Bạn";
    const displayName = prefix
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toLocaleUpperCase("vi") + part.slice(1))
      .join(" ");
    const next: DemoSession = { email: normalizedEmail, displayName };
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event(sessionEvent));
  }
  function logout() {
    window.localStorage.removeItem(storageKey);
    window.dispatchEvent(new Event(sessionEvent));
  }
  return { session, login, logout };
}

export function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const ready =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password.length >= 6;

  return (
    <main className="sp-login-page">
      <section className="sp-login-card" aria-labelledby="login-title">
        <div className="sp-login-brand">
          <span>
            <Compass size={25} />
          </span>
          <strong>SkillCompass</strong>
        </div>
        <p className="sp-eyebrow">CỔNG HỒ SƠ NĂNG LỰC</p>
        <h1 id="login-title">Đăng nhập</h1>
        <p className="sp-login-intro">
          Truy cập hồ sơ kỹ năng và lộ trình học tập của bạn.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!ready) {
              setError("Nhập email hợp lệ và mật khẩu từ 6 ký tự.");
              return;
            }
            onLogin(email);
          }}
        >
          <label htmlFor="login-email">Email</label>
          <div className="sp-login-input">
            <Mail size={17} aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="ban@example.com"
            />
          </div>
          <label htmlFor="login-password">Mật khẩu</label>
          <div className="sp-login-input">
            <LockKeyhole size={17} aria-hidden="true" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Tối thiểu 6 ký tự"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {error && (
            <p className="sp-error" role="alert">
              {error}
            </p>
          )}
          <button className="sp-primary sp-login-submit" disabled={!ready}>
            Đăng nhập <ArrowRight size={17} />
          </button>
        </form>
      </section>
    </main>
  );
}
