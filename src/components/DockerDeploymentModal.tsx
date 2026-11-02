import React, { useState } from 'react';
import { 
  X, 
  Container, 
  Copy, 
  Check, 
  Terminal, 
  Server, 
  Database, 
  CheckCircle2 
} from 'lucide-react';
import { useStore } from '../store/useStore';

export const DockerDeploymentModal: React.FC = () => {
  const { isDockerOpen, setIsDockerOpen } = useStore();
  const [activeFile, setActiveFile] = useState<'docker-compose' | 'dockerfile' | 'env'>('docker-compose');
  const [copied, setCopied] = useState(false);

  if (!isDockerOpen) return null;

  const dockerComposeContent = `version: '3.9'

services:
  # 1. UniKart Full-Stack Express & React Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: unikart-core-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://unikart_admin:SecureCampus2026!@postgres:5432/unikart_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=unikart_production_jwt_secret_student_os_2026
      - PAYMENT_WEBHOOK_SECRET=live_webhook_hmac_secret_2026
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - unikart-network

  # 2. PostgreSQL 16 (Relational & ACID Transaction Store)
  postgres:
    image: postgres:16-alpine
    container_name: unikart-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: unikart_admin
      POSTGRES_PASSWORD: SecureCampus2026!
      POSTGRES_DB: unikart_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U unikart_admin -d unikart_db"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - unikart-network

  # 3. Redis 7 (Distributed Locking, Rate Limiting & Real-Time Cart)
  redis:
    image: redis:7-alpine
    container_name: unikart-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass RedisCampus2026!
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    networks:
      - unikart-network

volumes:
  pgdata:
    driver: local
  redisdata:
    driver: local

networks:
  unikart-network:
    driver: bridge`;

  const dockerfileContent = `# Multi-Stage High-Security Dockerfile for UniKart
# Stage 1: Build Frontend Assets & Transpile Backend
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies with lockfile check
COPY package*.json ./
RUN npm ci

# Copy entire application source
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Minimalist, Hardened Production Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled assets and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Run as non-privileged student OS user
USER node

EXPOSE 3000
CMD ["npm", "start"]`;

  const envContent = `# UniKart Production Environment Configuration
NODE_ENV=production
PORT=3000

# PostgreSQL 16 Connection
DATABASE_URL=postgresql://unikart_admin:SecureCampus2026!@postgres:5432/unikart_db

# Redis 7 Distributed Lock & Session Connection
REDIS_URL=redis://redis:6379

# Cryptographic Keys & Webhook Secrets
JWT_SECRET=unikart_production_jwt_secret_student_os_2026
PAYMENT_WEBHOOK_SECRET=live_webhook_hmac_secret_2026
CAMPUS_LAB_PUBLIC_KEY=ECDSA-P256-SHA256-STANFORD-ROBOTICS-2026`;

  const getCurrentContent = () => {
    switch (activeFile) {
      case 'docker-compose': return dockerComposeContent;
      case 'dockerfile': return dockerfileContent;
      case 'env': return envContent;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
              <Container className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Containerization & Deployment Guide
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Docker Compose (App + PostgreSQL 16 + Redis 7) • 1-Command Setup
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDockerOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1-Command Startup Callout */}
        <div className="bg-slate-900 p-4 text-xs font-mono text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">$</span>
            <span>docker compose up --build -d</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Spins up App (Port 3000), Postgres (Port 5432) & Redis (Port 6379)
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2">
          <button
            onClick={() => setActiveFile('docker-compose')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeFile === 'docker-compose'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            docker-compose.yml
          </button>
          <button
            onClick={() => setActiveFile('dockerfile')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeFile === 'dockerfile'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Dockerfile (Multi-Stage)
          </button>
          <button
            onClick={() => setActiveFile('env')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeFile === 'env'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            .env.production
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              {activeFile === 'docker-compose' ? 'docker-compose.yml' : activeFile === 'dockerfile' ? 'Dockerfile' : '.env.production'}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-700 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied File' : 'Copy File Content'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-[11px] font-mono text-sky-300 max-h-96 overflow-y-auto">
            <pre>{getCurrentContent()}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
