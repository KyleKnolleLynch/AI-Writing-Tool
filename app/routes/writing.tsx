import { Form } from "@remix-run/react";

import { useUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  return json({ ok: true });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)

  return json({ ok: true })
}

// TODO   Create for for input
// TODO   Create the action submitting the form
// TODO   Bring recent completions onto page from database
// TODO   Add styling

export default function Writing() {
  const user = useUser();
  return (
    <div className="text-slate-100">
      <div className="mx-auto mt-4 flex w-full items-center justify-between px-6 text-slate-200">
        <p>Welcome {user?.email}</p>
        <div className="flex gap-5">
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
      <h1 className="text-2xl font-bold">AI Writing Tool</h1>
      <Form action="post">
        <fieldset className="mt-4 w-full">
          <textarea
            name="prompt"
            id="prompt"
            rows={5}
            className="w-full rounded-sm bg-slate-800 p-4 text-slate-200"
          ></textarea>

          <div className="mt-4 flex items-center">
            <input
              type="number"
              name="tokens"
              id="tokens"
              defaultValue={150}
              className="w-24 rounded-sm bg-slate-800 p-4 text-slate-200"
            />
            <button
              type="submit"
              className="ml-4 rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Submit
            </button>
            <div className="ml-4">
              You have {user.tokens.toLocaleString()} tokens remaining.
            </div>
          </div>
        </fieldset>
      </Form>
    </div>
  );
}
