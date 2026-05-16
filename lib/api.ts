// Client-side API utilities

export async function fetchSeeker() {
  const response = await fetch('/api/seeker', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    return { seeker: null };
  }

  if (!response.ok) {
    throw new Error('Failed to fetch seeker data');
  }

  return response.json();
}

export async function updateSeeker(data: Record<string, any>) {
  const response = await fetch('/api/seeker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update seeker data');
  }

  return result;
}

export async function fetchProvider() {
  const response = await fetch('/api/provider', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    return { provider: null };
  }

  if (!response.ok) {
    throw new Error('Failed to fetch provider data');
  }

  return response.json();
}

export async function updateProvider(data: Record<string, any>) {
  const response = await fetch('/api/provider', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update provider data');
  }

  return result;
}

export async function fetchJobs() {
  const response = await fetch('/api/jobs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    return { jobs: [] };
  }

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  return response.json();
}

export async function createJobPosting(data: Record<string, any>) {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create job posting');
  }

  return result;
}
