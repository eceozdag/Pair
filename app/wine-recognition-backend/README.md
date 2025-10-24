# Wine Recognition Backend

This project is a backend service for a wine recognition application that utilizes machine learning for pairing logic, community pairings, and expert recommendations. It also implements open-source computer vision for wine recognition, allowing users to provide feedback on their experiences.

## Features

- **Wine Recognition**: Uses computer vision techniques to identify wine bottles and classify their labels.
- **Pairing Logic**: Machine learning algorithms suggest wine pairings based on community feedback and expert recommendations.
- **User Feedback**: Users can provide feedback on pairings and recognition accuracy, which helps improve the model over time.
- **RESTful API**: The backend exposes a RESTful API for the iOS client to interact with.

## Project Structure

- `src/`: Contains the source code for the application.
  - `index.ts`: Entry point of the application.
  - `app.ts`: Configures the Express application.
  - `api/`: Contains routes and controllers for managing wines and pairings.
  - `services/`: Contains business logic for recognition, pairing, and feedback.
  - `ml/`: Contains machine learning scripts for training and inference.
  - `vision/`: Contains computer vision scripts and model configurations.
  - `db/`: Contains database schema and migrations.
  - `clients/`: Contains the iOS client code for interacting with the backend.
  - `utils/`: Contains utility functions, such as logging.

- `scripts/`: Contains scripts for setting up the environment and deploying the application.
- `tests/`: Contains unit and integration tests for the application.
- `docs/`: Contains documentation related to the architecture of the project.
- `openapi.yaml`: Defines the OpenAPI specification for the API.
- `Dockerfile`: Instructions for building the Docker image.
- `docker-compose.yml`: Configuration for Docker Compose.
- `package.json`: Lists dependencies and scripts for the project.
- `tsconfig.json`: TypeScript configuration file.
- `.env.example`: Example environment variables needed for the application.
- `.gitignore`: Lists files and folders to be ignored by Git.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd wine-recognition-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the machine learning environment:
   ```
   ./scripts/setup_ml_env.sh
   ```

4. Start the application:
   ```
   npm start
   ```

5. Access the API documentation at `http://localhost:3000/api-docs`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.