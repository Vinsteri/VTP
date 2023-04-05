FROM node:14

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

# Set environment variables
ENV PORT=3000
ENV DB_HOST=db
ENV DB_USER=root
ENV DB_PASSWORD=secret
ENV DB_NAME=mydatabase

# Expose port
EXPOSE ${PORT}

# Start server
CMD [ "./wait-for-it.sh", "db:3306", "-t", "60", "--", "npm", "start" ]