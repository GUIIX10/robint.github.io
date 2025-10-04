import express from 'express';

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

let students = []; // In-memory database for student data
let idCounter = 1;   // Simple ID counter for new students

// CREATE - Add a new student
app.post('/students', (req, res) => {
  const student = { id: idCounter++, ...req.body }; // Assign ID and add request body
  students.push(student);
  res.status(201).json(student); // Respond with 201 Created and the new student
});

// READ ALL - Get all students
app.get('/students', (req, res) => {
  res.json(students); // Respond with the array of students
});

// READ ONE - Get a student by ID
app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id == req.params.id); // Find student by ID
  student ? res.json(student) : res.status(404).send('Not Found'); // Respond or send 404
});

// UPDATE - Update an existing student by ID
app.put('/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id == req.params.id); // Find index of student
  if (index !== -1) {
    // Update student, ensuring ID remains the same
    students[index] = { id: parseInt(req.params.id), ...req.body };
    res.json(students[index]); // Respond with the updated student
  } else {
    res.status(404).send('Not Found'); // Send 404 if student not found
  }
});

// DELETE - Delete a student by ID
app.delete('/students/:id', (req, res) => {
  students = students.filter(s => s.id != req.params.id); // Filter out the deleted student
  res.sendStatus(204); // Respond with 204 No Content
});

// Start the server
app.listen(3000, () => console.log('API running on http://localhost:3000'));
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'Student CRUD API', // API title
      version: '1.0.0',          // API version
      description: 'A simple CRUD API for managing student records.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Base URL of your API
        description: 'Local development server',
      },
    ],
  },
  apis: ['./server.js'], // Path to the API docs (JSDoc comments in this file)
};

const swaggerSpec = swaggerJsdoc(options); // Initialize swagger-jsdoc
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve a list of all student records.
 *     responses:
 *       200:
 *         description: A list of students.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The student's ID.
 *                   name:
 *                     type: string
 *                     description: The student's name.
 *                   age:
 *                     type: integer
 *                     description: The student's age.
 *             examples:
 *               StudentsArray:
 *                 value:
 *                   - id: 1
 *                     name: "Alice"
 *                     age: 20
 *                   - id: 2
 *                     name: "Bob"
 *                     age: 22
 */
app.get('/students', (req, res) => {
  res.json(students);
});
/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *                 description: The student's name.
 *               age:
 *                 type: integer
 *                 description: The student's age.
 *           examples:
 *             NewStudent:
 *               value:
 *                 name: "Charlie"
 *                 age: 21
 *     responses:
 *       201:
 *         description: The created student.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 */
app.post('/students', (req, res) => {
  const student = { id: idCounter++, ...req.body };
  students.push(student);
  res.status(201).json(student);
});
/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the student to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single student.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *       404:
 *         description: Student not found.
 */
app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id == req.params.id);
  student ? res.json(student) : res.status(404).send('Not Found');
});
/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the student to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *           examples:
 *             UpdatedStudent:
 *               value:
 *                 name: "Alice Smith"
 *                 age: 21
 *     responses:
 *       200:
 *         description: The updated student.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *       404:
 *         description: Student not found.
 */
app.put('/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    students[index] = { id: parseInt(req.params.id), ...req.body };
    res.json(students[index]);
  } else {
    res.status(404).send('Not Found');
  }
});
/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the student to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *           examples:
 *             UpdatedStudent:
 *               value:
 *                 name: "Alice Smith"
 *                 age: 21
 *     responses:
 *       200:
 *         description: The updated student.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *       404:
 *         description: Student not found.
 */
app.put('/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    students[index] = { id: parseInt(req.params.id), ...req.body };
    res.json(students[index]);
  } else {
    res.status(404).send('Not Found');
  }
});
/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the student to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Student successfully deleted.
 *       404:
 *         description: Student not found (though our current implementation always returns 204 if ID format is valid).
 */
app.delete('/students/:id', (req, res) => {
  students = students.filter(s => s.id != req.params.id);
  res.sendStatus(204);
});