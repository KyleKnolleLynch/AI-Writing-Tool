import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-100">
          Welcome to AI Writing Assistant
        </h1>
        {user ? (
          <div className="mx-auto mt-4 flex w-full items-center justify-between px-6 text-slate-200">
            <p>Welcome {user?.email}</p>
            <div className="flex gap-5">
              <Link
                to="/writing"
                className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Start Writing
              </Link>
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                >
                  Logout
                </button>
              </Form>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex w-full items-center justify-center text-slate-200">
            <div className="flex gap-5">
              <Link
                to="/join"
                className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Join
              </Link>
              <Link
                to="/login"
                className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
