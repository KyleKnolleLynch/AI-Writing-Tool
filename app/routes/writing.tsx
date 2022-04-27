import { Form, useActionData } from "@remix-run/react";

import { useUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserById, UpdateTokens } from "~/models/user.server";
import { addCompletion } from "~/models/completions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  return json({ ok: true });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const currentUser = await getUserById(userId);

  const reqBody = await request.formData();
  const body = Object.fromEntries(reqBody);

  // Check the user has enought tokens to write
  const errors = {
    tokens:
      currentUser && Number(body.tokens) > currentUser.tokens
        ? "Not enought tokens"
        : undefined,
  };

  //  if not enough return an error
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) {
    return json(errors);
  }

  //  Make the request to OPEN API
  try {
    const response = await fetch(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        },
        body: JSON.stringify({
          prompt: body.prompt,
          max_tokens: Number(body.tokens),
          temperature: 0.9,
          top_p: 1,
          frequency_penalty: 0.52,
          presence_penalty: 0.9,
          n: 1,
          best_of: 2,
          stream: false,
          logprobs: null,
        }),
      }
    );

    const data = await response.json();
    const completionText = data.choices[0].text;

    // Save the completion to the database
    const addedCompletion = await addCompletion({
      aiCompletion: completionText,
      userId,
      prompt: String(body.prompt),
      tokens: Number(body.tokens),
    });

    console.log(addedCompletion);

    //  Update the user tokens if request successful
    const updatedTokens = await UpdateTokens(userId, Number(currentUser && currentUser?.tokens - Number(body.tokens))) 

    return json(addedCompletion, updatedTokens)

  } catch (error: any) {
    //  if not successful return error
    return json({ error: error.message });
  }
};

// TODO   Create form for input
// TODO   Create the action submitting the form
// TODO   Bring recent completions onto page from database
// TODO   Add styling

export default function Writing() {
  const user = useUser();
  const errors = useActionData();
  console.log(errors)
  

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
      <Form method="post">
        <fieldset className="mt-4 w-full">
          <textarea
            name="prompt"
            id="prompt"
            rows={5}
            className="w-full rounded-sm bg-slate-800 p-4 text-slate-200"
          ></textarea>
          {errors && <p className="text-sm text-red-700">{errors.tokens}</p>}

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
