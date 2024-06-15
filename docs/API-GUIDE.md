# ForSure API Guide

## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Available Endpoints](#available-endpoints)
  - [Create Project](#create-project)
  - [Validate Structure](#validate-structure)
  - [List Projects](#list-projects)
  - [Get Project Details](#get-project-details)
  - [Delete Project](#delete-project)
- [Request/Response Formats](#requestresponse-formats)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Introduction

The ForSure API allows you to manage and validate project structures programmatically. You can create, validate, list, and delete project structures using RESTful endpoints.

## Setup

### Base URL

The base URL for the API is:
https://api.forsure.com/v1

Copy
Insert

### Authentication

All API requests require authentication via API key. Include the API key in the headers of your requests:
Authorization: Bearer YOUR_API_KEY

Copy
Insert

## Available Endpoints

### Create Project

**Endpoint:** `POST /projects`

**Description:** Create a new project with a specified structure.

**Request:**
```json
{
  "name": "my-project",
  "structure": "root: { 'index.html': [ size: '5KB', type: 'html' ] }"
}
Response:

JSON
Copy
Insert
{
  "id": "12345",
  "name": "my-project",
  "structure": "root: { 'index.html': [ size: '5KB', type: 'html' ] }",
  "createdAt": "2023-10-01T00:00:00Z"
}
Validate Structure
Endpoint: POST /projects/:id/validate

Description: Validate the structure of an existing project.

Request:

JSON
Copy
Insert
{
  "structure": "root: { 'index.html': [ size: '5KB', type: 'html' ] }"
}
Response:

JSON
Copy
Insert
{
  "isValid": true,
  "errors": []
}
List Projects
Endpoint: GET /projects

Description: Retrieve a list of all projects.

Response:

JSON
Copy
Insert
{
  "projects": [
    {
      "id": "12345",
      "name": "my-project",
      "createdAt": "2023-10-01T00:00:00Z"
    }
  ]
}
Get Project Details
Endpoint: GET /projects/:id

Description: Retrieve the details of a specific project.

Response:

JSON
Copy
Insert
{
  "id": "12345",
  "name": "my-project",
  "structure": "root: { 'index.html': [ size: '5KB', type: 'html' ] }",
  "createdAt": "2023-10-01T00:00:00Z"
}
Delete Project
Endpoint: DELETE /projects/:id

Description: Delete a specific project.

Response:

JSON
Copy
Insert
{
  "message": "Project deleted successfully."
}
Request/Response Formats
Content-Type: All requests and responses are in JSON format.
Headers: Include header Content-Type: application/json for all requests.
Authentication
To authenticate with the ForSure API, include your API key in the Authorization header:

Copy
Insert
Authorization: Bearer YOUR_API_KEY
Error Handling
The API uses standard HTTP status codes to indicate success or failure. Common status codes include:

200 OK: The request was successful.
201 Created: The resource was created successfully.
400 Bad Request: The request was invalid or cannot be served.
401 Unauthorized: Authentication is required and has failed or has not yet been provided.
404 Not Found: The requested resource could not be found.
500 Internal Server Error: An error occurred on the server.
Example Error Response:

JSON
Copy
Insert
{
  "error": "Invalid structure format."
}
Examples
Create a Project
Request:

Shell Script
Copy
Insert
curl -X POST https://api.forsure.com/v1/projects \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-project",
    "structure": "root: { \'index.html\': [ size: \'5KB\', type: \'html\' ] }"
  }'
Response:

JSON
Copy
Insert
{
  "id": "12345",
  "name": "my-project",
  "structure": "root: { 'index.html': [ size: '5KB', type: 'html' ] }",
  "createdAt": "2023-10-01T00:00:00Z"
}
Validate a Project Structure
Request:

Shell Script
Copy
Insert
curl -X POST https://api.forsure.com/v1/projects/12345/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "structure": "root: { \'index.html\': [ size: \'5KB\', type: \'html\' ] }"
  }'
Response:

JSON
Copy
Insert
{
  "isValid": true,
  "errors": []
}
List Projects
Request:

Shell Script
Copy
Insert
curl -X GET https://api.forsure.com/v1/projects \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
Response:

JSON
Copy
Insert
{
  "projects": [
    {
      "id": "12345",
      "name": "my-project",
      "createdAt": "2023-10-01T00:00:00Z"
    }
  ]
}
Get Project Details
Request:

Shell Script
Copy
Insert
curl -X GET https://api.forsure.com/v1/projects/12345 \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
Response:

JSON
Copy
Insert
{
  "id": "12345",
  "name": "my-project",
  "structure": "root: { 'index.html': [ size: '5KB', type: 'html' ] }",
  "createdAt": "2023-10-01T00:00:00Z"
}
Delete a Project
Request:

Shell Script
Copy
Insert
curl -X DELETE https://api.forsure.com/v1/projects/12345 \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
Response:

JSON
Copy
Insert
{
  "message": "Project deleted successfully."
}
This 
API-GUIDE.md
 provides a comprehensive guide for developers on how to interact with the ForSure API, including setup, available endpoints, request/response formats, authentication, error handling, and practical examples.