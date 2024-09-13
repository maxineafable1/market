import { queryOptions } from "@tanstack/react-query"

export const getPosts = (page: number, items: number) => queryOptions({
  queryKey: ['posts'],
  queryFn: async () => {
    const res = await fetch(`http://localhost:4000/api/posts?page=${page}&items=${items}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return res.json()
  }
})

export const getPost = (postId: string, type: string) => queryOptions({
  queryKey: ['posts', { postId }],
  queryFn: async () => {
    const res = await fetch(`http://localhost:4000/api/posts/${postId}?type=${type}s`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return res.json()
  }
})

export const getUserInfo = (id: string) => queryOptions({
  queryKey: ['users'],
  queryFn: async () => {
    const res = await fetch(`http://localhost:4000/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return res.json()
  }
})

export const getUserPosts = (id: string) => queryOptions({
  queryKey: ['user-posts'],
  queryFn: async () => {
    const res = await fetch(`http://localhost:4000/api/posts/user-posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${access}`
      },
      // body: JSON.stringify({ id })
    })
    return res.json()
  }
})

export async function login(formData: FormData) {
  const res = await fetch('http://localhost:4000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneOrEmail: formData.get('phoneOrEmail'),
      password: formData.get('password'),
    })
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error)
  }
  return data
}

export async function signup(formData: FormData) {
  const res = await fetch('http://localhost:4000/api/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: formData.get('phone'),
      email: formData.get('email'),
      password: formData.get('password'),
    })
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error)
  }
  return data
}

export async function logout(refresh: string) {
  const res = await fetch('http://localhost:4000/api/users/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh })
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error)
  }
  return
}
