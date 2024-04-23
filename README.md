## Quikstart

This component visualizes events on a compact timeline, allowing you to edit with minimal space usage. It utilizes packages such as Redux, React, TypeScript, and more.

The component is also responsive, suitable for use on mobile, tablet, and desktop devices.

To get started run

    npm install
    npm run start

## Pattern

This pattern is not only designed to present a single component but is also prepared to receive other pages. The idea is that if your website grows in the future, you can use this pattern to create new pages.

### Folder structure

src <br/>
|\_\_ actions <br/>
|\_\_components<br/>
|\_\_ config<br/>
|\_\_pages<br/>

src <br/>
|\_\_ actions :: actions classes to call backend endpoints, I created a mock action <br/>
|\_\_components :: components that can be used in different pages<br/>
|\_\_ config :: configurations, including the redux store <br/>
|\_\_pages :: All pages from your website, its like a same that you can found in a next.js project.<br/>

## Duration

This project took me approximately 8 hours

-   Around 1 hour was spent on research, based on existing timelines. Images used can be found in the src/doc folder.
-   Approximately 2 hours were dedicated to basic development.
-   The remaining 5 hours were focused on improvements, including the addition of various levels of difficulty:
    -   Implemented a resizer
        ![alt text](/design/resizable.png)
    -   Added drag and drop functionality.
    -   Enhanced color schemes for color-blind users.
    -   Implemented Redux for state management. Additionally, there is a branch with the same implementation using reducers.

# About the implementation

Initial planning proved challenging, but after some research, I found an effective approach to implementing the timeline.

# Changes

Given more time, I would opt for a different approach, including a zoom feature. I envision starting with the month view and allowing users to zoom in to view individual days on the timeline.

# Design decisions

I conducted research before starting the project and found several timelines with similar features. Implementing these features proved challenging, especially when dealing with a dense quantity of events overlapping each other. Some features and corrections are yet to be implemented, all outlined in TODO.md.

# Testing

There are numerous features to test:

-   Drag and drop functionality.
-   Resizing capability.
-   Changing event names, and more.

Also is more easy to test the component with reducers or Redux, you can test easily the actions and reducers.
For end-to-end (E2E) testing, I prefer Cypress due to its ease of use. It also facilitates unit testing.
