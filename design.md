# Design Documentation

## Overview

This document outlines the design of a system to handle the settlement process between Party A and Party B. The system allows Party A to submit and modify settlement amounts, while Party B can dispute or agree to these amounts. The process ensures both parties are updated on each other's actions.

## Technology Stack

- **Frontend**: React, Vite, Typescript, Tailwind CSS
- **API Mocking**: MirageJS
- **State Management**: [Ezmodel](https://www.npmjs.com/package/ezmodel)

## Objectives

### Part 1: Settlement Submission and Negotiation

1. Initial Submission: Party A can submit an initial settlement amount.
2. Modification and Resubmission: Party A can modify and resubmit the settlement amount until Party B responds.
3. Dispute and Agreement Handling: Party B can dispute or agree to the amount. If disputed, Party A can modify and resubmit the amount.
4. Display Responses: Party A’s interface displays Party B’s response (dispute or agreement), and Party B’s interface shows the amount submitted by Party A.
5. Settlement Completion: The system transitions to a settled state once Party B agrees.

### Part 2: Handling Modifications and Responses

1. Detect Responses During Modifications: The system detects if Party B responds during Party A’s modification process.
2. Explicit User Action for Updates: Party A’s interface prompts for a page refresh to see updated status.
3. Real-Time Updates Not Required: No automatic refreshing or real-time updates needed for this part.

## Components and Structure

Sure, I'll update the Frontend structure based on the provided image.

## Updated Components and Structure

### Frontend

#### Components

1. **App Component**: Root component managing routes and global state.
2. **ReviewForm**: Form for Party B to review and respond to Party A’s submissions.
   - `index.tsx`: Entry point for the ReviewForm component.
   - `ReviewForm.tsx`: Main component file for rendering the review form.
   - `useReviewForm.ts`: Custom hook for managing form state and logic.
3. **SubmitForm**: Form for Party A to submit and modify settlement amounts.
   - `index.tsx`: Entry point for the SubmitForm component.
   - `SubmitForm.tsx`: Main component file for rendering the submit form.
   - `useSubmitForm.ts`: Custom hook for managing form state and logic.
4. **ErrorMessage.tsx**: Component for displaying error messages.
5. **LoadingIndicator.tsx**: Component for showing a loading indicator.

#### Pages

1. **MainPage.tsx**: The main page of the application, possibly a dashboard or landing page.
2. **PartyAPage.tsx**: Page for Party A’s interface to submit and manage settlements.
3. **PartyBPage.tsx**: Page for Party B’s interface to review and respond to settlements.

#### Hooks

- **Custom hooks**: Additional hooks for managing state and logic across the application.

#### API

1. **client.ts**: API client configuration and methods.
2. **server.ts**: MirageJS server setup and route handlers.

### File Structure

```text
src/
|-- api/
|   |-- client.ts
|   |-- server.ts
|-- assets/
|-- components/
|   |-- ReviewForm/
|   |   |-- index.tsx
|   |   |-- ReviewForm.tsx
|   |   |-- useReviewForm.ts
|   |-- SubmitForm/
|   |   |-- index.tsx
|   |   |-- SubmitForm.tsx
|   |   |-- useSubmitForm.ts
|   |-- ErrorMessage.tsx
|   |-- LoadingIndicator.tsx
|-- hooks/
|-- pages/
|   |-- MainPage.tsx
|   |-- PartyAPage.tsx
|   |-- PartyBPage.tsx
|-- App.css
|-- App.tsx
|-- index.css
|-- main.tsx
|-- types.ts
|-- vite-env.d.ts
```

## MirageJS for API Mocking

### MirageJS Setup

The following setup for MirageJS includes endpoints for submitting settlements, retrieving status, and responding to settlements. It also includes validation using Zod schemas to ensure data integrity.

```javascript
import { createServer } from "miragejs";
import { RespondSchema, Settlement, SettlementSchema } from "../types";
import { ZodType, z } from "zod";

// Utility to parse and validate JSON payloads using Zod
const fromJSON = <T extends ZodType<any, any, any>>(type: T) =>
  z
    .string()
    .transform((value) => {
      return JSON.parse(value);
    })
    .pipe(type) as T;

// Validation schemas for request payloads
const SubmitPayloadVal = fromJSON(
  z.object({ amount: SettlementSchema.shape.amount })
);

const RespondPayloadVal = fromJSON(
  z.object({
    comment: SettlementSchema.shape.comment,
    response: RespondSchema,
  })
);

// Current state of the settlement
let currentSettlement: Settlement | undefined;

// MirageJS server setup
createServer({
  routes() {
    this.post("/api/submit", async (_schema, request) => {
      const { amount } = SubmitPayloadVal.parse(request.requestBody);
      if (currentSettlement?.stage === "approved") {
        throw new Error("The settlement is approved. No changes can be made.");
      }
      currentSettlement = { stage: "submitted", amount };
    });

    this.get("/api/status", async () => currentSettlement);

    this.post("/api/respond", async (_schema, request) => {
      if (!currentSettlement) {
        throw new Error("No settlement submitted");
      }
      if (currentSettlement.stage === "approved") {
        throw new Error("The settlement is approved. No changes can be made.");
      }

      const { response, comment } = RespondPayloadVal.parse(
        request.requestBody
      );

      currentSettlement = {
        amount: currentSettlement.amount,
        comment,
        stage: response === "approve" ? "approved" : "rejected",
      };
    });
  },
});
```

### Endpoint Descriptions

1. **POST `/api/submit`**:

   - **Description**: Allows Party A to submit or modify the settlement amount.
   - **Request Body**: JSON object containing the `amount`.
   - **Validation**: Uses Zod to validate the `amount`.
   - **Response**: Updates the current settlement with the new amount and sets the stage to "submitted".
   - **Error Handling**: Throws an error if the settlement is already approved and no changes can be made.

2. **GET `/api/status`**:

   - **Description**: Retrieves the current status of the settlement.
   - **Response**: Returns the current settlement details, including the amount and stage.

3. **POST `/api/respond`**:
   - **Description**: Allows Party B to respond to the submitted settlement.
   - **Request Body**: JSON object containing the `response` (approve/reject) and an optional `comment`.
   - **Validation**: Uses Zod to validate the `response` and `comment`.
   - **Response**: Updates the current settlement with the response and sets the stage to "approved" or "rejected".
   - **Error Handling**: Throws an error if there is no settlement submitted or if the settlement is already approved.

This setup ensures that the frontend can interact with a mocked backend, simulating real API behavior while using robust validation to maintain data integrity.

```javascript
import React, { createContext, useState, useContext } from "react";

const SettlementContext = createContext(null);

export const SettlementProvider = ({ children }) => {
  const [status, setStatus] = useState("initial");
  const [response, setResponse] = useState("none");

  const submitAmount = (amount) => {
    // API call to submit amount
  };

  const fetchStatus = () => {
    // API call to fetch status
  };

  const respondToSubmission = (response) => {
    // API call to respond to submission
  };

  return (
    <SettlementContext.Provider
      value={{
        status,
        response,
        submitAmount,
        fetchStatus,
        respondToSubmission,
      }}
    >
      {children}
    </SettlementContext.Provider>
  );
};

export const useSettlement = () => useContext(SettlementContext);
```

## User Interfaces

### Party A’s Interface

1. **SubmitForm**:

   - **Component**: `SubmitForm.tsx`
   - **Functionality**: Allows Party A to input and submit the initial settlement amount, as well as modify and resubmit the amount if necessary.
   - **Custom Hook**: `useSubmitForm.ts` for managing form state and logic.
   - **Layout**: Includes an input field for the settlement amount, a submit button, and feedback messages.

### Party B’s Interface

1. **ReviewForm**:

   - **Component**: `ReviewForm.tsx`
   - **Functionality**: Allows Party B to review the settlement amount submitted by Party A and respond with either an agreement or a dispute.
   - **Custom Hook**: `useReviewForm.ts` for managing form state and logic.
   - **Layout**: Displays the submitted amount from Party A and includes buttons to agree or dispute the amount.

### Common Components

1. **ErrorMessage**:

   - **Component**: `ErrorMessage.tsx`
   - **Functionality**: Displays error messages for both Party A and Party B when any issue occurs.
   - **Layout**: A styled error message box that provides feedback to the user.

2. **LoadingIndicator**:
   - **Component**: `LoadingIndicator.tsx`
   - **Functionality**: Shows a loading spinner or indicator when the application is processing data or waiting for a response.
   - **Layout**: A spinner or progress bar indicating loading status.

### Pages

1. **MainPage**:

   - **Component**: `MainPage.tsx`
   - **Functionality**: Serves as the landing page or dashboard of the application.
   - **Layout**: Includes navigation to Party A and Party B pages, and a summary of current activities if applicable.

2. **PartyAPage**:

   - **Component**: `PartyAPage.tsx`
   - **Functionality**: Dedicated page for Party A to submit and manage settlements.
   - **Layout**: Combines `SubmitForm`, `SettlementStatus`, and possibly `Notification` components.

3. **PartyBPage**:
   - **Component**: `PartyBPage.tsx`
   - **Functionality**: Dedicated page for Party B to review and respond to settlements.
   - **Layout**: Combines `ReviewForm` and `SettlementStatus` components.

This updated structure ensures that both Party A and Party B have dedicated interfaces tailored to their roles in the settlement process, with shared components for consistent user experience and functionality.

## Design Rationale

- **React**: Chosen for its component-based architecture, which promotes reusability and maintainability. React's virtual DOM ensures efficient updates and rendering, enhancing the performance of the application.
- **Vite**: Selected for its fast and efficient development environment. Vite offers instant server start, lightning-fast hot module replacement (HMR), and optimized build performance, making the development process smoother and more productive.

- **MirageJS**: Used for API mocking, allowing the development of frontend features without dependency on a backend. This enables the team to focus on building and testing UI interactions and logic without waiting for backend endpoints to be available.

- **Typescript**: Implemented for its static typing capabilities, which enhance code quality and maintainability. Typescript helps catch errors at compile-time rather than runtime, reducing the likelihood of bugs. It also improves developer productivity by providing better tooling support, such as autocompletion, refactoring, and type checking.

- **Tailwind CSS**: Chosen for its utility-first CSS approach, which allows rapid and consistent styling. Tailwind's predefined classes help maintain design consistency and reduce the need for writing custom CSS, speeding up the development process.

## Future Enhancements

1. **Real-Time Updates**: Implement WebSocket or polling for real-time status updates.
2. **Backend Integration**: Replace MirageJS with actual backend services.
3. **Database**: Integrate a database for persistent storage of settlement data.
4. **Advanced Validation**: Add more robust validation and error handling for input fields and API responses.
