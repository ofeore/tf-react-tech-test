# TASK MANAGER NOTES

## Backend (server/index.ts)

I extended the task model by introducing a priority field for the GET /api/tasks route to enable a priority query of 'low', 'medium', or 'high' (e.g. GET /api/tasks?priority=high).

The Express server validates the query parameter, destructured from the HTTP request, to ensure it conforms with the Priority type declared in types.ts.

The response then returns a filtered version of the tasks according to the priority provided in the query.

To ensure that the original data is not mutated, I used the .filter() method as it returns a new array. Likewise, throughout the project I use the .map() method or the spread operator to prevent mutation of data.

I started the project by initially filtering priority on the client-side to mock up the UI, and then implemented the backend helpers once I was happy with this.

I also expanded validation when creating or updating tasks. For example, titles must be non-empty strings and are limited to 100 characters. Invalid requests return clear error messages and appropriate HTTP status codes.

I tested that these error messages work by sending bad requests in Insomnia, such as using a priority value of "urgent" or providing an empty string as the title.

---

## Frontend (App.tsx, TaskList.tsx, App.css)

In the frontend, I created new states for adding priority levels to tasks and filtering by priority.

I was also keen to create a clear separation between active and completed tasks, so I added a completedTasks state.

After creating the structure for the active and completed task lists, I decided it would increase readability to avoid duplicating code by implementing a TaskList component. Similarly, I extracted the inline styling to a separate CSS file so that I could reduce clutter in the main page by using classes. This also allowed me to enhance the UI elements by styling with flex and adding interactive elements such as hover states, different button colours, and error message styling.

There is also optimistic rendering for creating and deleting tasks. The create flow was particularly interesting because I had to essentially create a temporary task object on the client side and then replace it with the real server response once the request completed. React immediately re-renders to display the change, but alerts the user if there is a backend error and restores the previous state.

When filtering tasks according to priority, I encountered an issue where completed tasks would also disappear if they fell under the filtered priority. I really wanted completed tasks to always remain visible, as I think it is important that the user can easily compare how many tasks they have completed and how many remain. This was tricky because the filtered tasks were being fetched through the query parameter, so I needed another way to retain the completed tasks. I decided to store them locally as an array using the completedTasks state.

For simplicity, I keep all state in App.tsx and pass props down to TaskList.tsx. If this were a larger application, I might split this into more stateful components. For example, if I were to implement a calendar component with due dates, that would likely manage its own state.

I also tested that backend error messages could be displayed to the user on the frontend. For example, if a task title longer than 100 characters is submitted, the raw backend error will appear. This is mainly to demonstrate that the error handling works. Since that message is not very user-friendly, I added a more helpful client-side validation message for when a user attempts to add an empty task. There is also some basic sanitisation of input to normalise unusual casing in task titles.

---

## What I would improve with more time

With more time I would focus on a few improvements:

- improving the layout for different screen sizes
- adding persistence (e.g. saving tasks in local storage or a database)
- adding loading states for individual actions such as create or delete
