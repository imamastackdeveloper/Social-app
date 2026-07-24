import { useState, useCallback } from 'react';
import openai from '../lib/openai';

const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePost = useCallback(async (prompt) => {
    setLoading(true);
    setError('');
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: 'You are a social media writing assistant. The user will give you a brief idea for their post. Generate an engaging social media post. Return JSON: { "description": "..." }. Keep under 280 characters. Be natural and warm. No hashtags unless requested.',
          },
          { role: 'user', content: prompt },
        ],
      });
      const text = response.choices[0].message.content;
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return { success: true, description: parsed.description || '' };
      }
      return { success: true, description: text };
    } catch (err) {
      setError('Failed to generate post. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const suggestComment = useCallback(async (postDescription) => {
    setLoading(true);
    setError('');
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `You are helping a user write a comment on a social media post. The post is: ${postDescription}. Write a short genuine comment (1-2 sentences). Be conversational. Do not use hashtags. Do not be generic like Great post.`,
          },
          { role: 'user', content: 'Suggest a comment' },
        ],
      });
      const text = response.choices[0].message.content;
      return { success: true, comment: text };
    } catch (err) {
      setError('Failed to generate comment. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeProfile = useCallback(async (bio, name, location) => {
    setLoading(true);
    setError('');
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `You are a professional profile writer. Current bio: ${bio || 'empty'}. Name: ${name || 'unknown'}. Location: ${location || 'unknown'}. Write an improved bio that is professional, warm and engaging. Keep it under 150 characters. Return only the bio text.`,
          },
          { role: 'user', content: 'Optimise my bio' },
        ],
      });
      const text = response.choices[0].message.content;
      return { success: true, bio: text };
    } catch (err) {
      setError('Failed to optimise profile. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return {
    loading,
    error,
    generatePost,
    suggestComment,
    optimizeProfile,
    clearError,
  };
};

export default useAI;
