FROM node:24

WORKDIR /usr/src/app

COPY . .

# Install dependencies
RUN npm install 
RUN npm install -g @angular/cli 

# Setup prisma database
ENV DATABASE_URL=file:/usr/src/app/bookmarks.db
RUN npx prisma generate

# Build the application
RUN npm run build

# Entrypoint: deploy migrations and start backend
RUN chmod +x /usr/src/app/entrypoint.sh
CMD ["/usr/src/app/entrypoint.sh"]