# The city-weather project

![Alt text](.//screenshot.png?raw=true "Screenshot")

## Project Structure
- `backend`: the nestjs app for serving city-weather data
- `frontend`: the react app for displaying city-weather data

For more information, go deeper in the sub-project folders.

## Run project
In the project directory, you can run:

```bash
# build app images
$ docker-compose build

# start docker services
$ docker-compose up
```
After all the services are deployed:
- open [http://localhost:3000](http://localhost:3000) to use the webapp.
- open [http://localhost:8080/api](http://localhost:8080/api) to browse the api documents.
