'use client'

import { useState, useEffect } from 'react';

// Define supported languages
export const SUPPORTED_LANGUAGES = ['en', 'ko'];
export type SupportedLanguage = 'en' | 'ko';

// Translation dictionaries
const translations: Record<string, Record<string, string>> = {
  en: {
    // Auth
    'login': 'Log In',
    'signup': 'Sign Up',
    'logout': 'Log Out',
    'email': 'Email',
    'password': 'Password',
    'forgotPassword': 'Forgot password?',
    'confirmPassword': 'Confirm Password',
    'displayName': 'Display Name',
    'continueWithGoogle': 'Continue with Google',
    'continueWithApple': 'Continue with Apple',
    'alreadyHaveAccount': 'Already have an account?',
    'dontHaveAccount': 'Don\'t have an account?',
    'loginError': 'Login failed. Please check your credentials.',
    'registerError': 'Registration failed. Please try again.',
    
    // Navigation
    'home': 'Home',
    'explore': 'Explore',
    'notifications': 'Notifications',
    'messages': 'Messages',
    'bookmarks': 'Bookmarks',
    'profile': 'Profile',
    'settings': 'Settings',
    'search': 'Search...',
    'theme': 'Theme',
    
    // Post
    'newPost': 'New Post',
    'whatsOnYourMind': 'What\'s on your mind?',
    'photo': 'Photo',
    'video': 'Video',
    'location': 'Location',
    'postComment': 'Add a comment...',
    'send': 'Send',
    
    // Profile
    'follow': 'Follow',
    'following': 'Following',
    'followers': 'Followers',
    'posts': 'Posts',
    'editProfile': 'Edit Profile',
    'bio': 'Bio',
    
    // Other
    'trendingTopics': 'Trending Topics',
    'suggestedConnections': 'Suggested Connections',
    'seeAll': 'See all',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'loading': 'Loading...',
    'noResults': 'No results found',
    'error': 'An error occurred',
    'or': 'or'
  },
  ko: {
    // Auth
    'login': '로그인',
    'signup': '회원가입',
    'logout': '로그아웃',
    'email': '이메일',
    'password': '비밀번호',
    'forgotPassword': '비밀번호를 잊으셨나요?',
    'confirmPassword': '비밀번호 확인',
    'displayName': '이름',
    'continueWithGoogle': 'Google로 계속하기',
    'continueWithApple': 'Apple로 계속하기',
    'alreadyHaveAccount': '이미 계정이 있으신가요?',
    'dontHaveAccount': '계정이 없으신가요?',
    'loginError': '로그인에 실패했습니다. 자격 증명을 확인하세요.',
    'registerError': '가입에 실패했습니다. 다시 시도해주세요.',
    
    // Navigation
    'home': '홈',
    'explore': '탐색',
    'notifications': '알림',
    'messages': '메시지',
    'bookmarks': '북마크',
    'profile': '프로필',
    'settings': '설정',
    'search': '검색...',
    'theme': '테마',
    
    // Post
    'newPost': '새 게시물',
    'whatsOnYourMind': '무슨 생각을 하고 계신가요?',
    'photo': '사진',
    'video': '동영상',
    'location': '위치',
    'postComment': '댓글 추가...',
    'send': '보내기',
    
    // Profile
    'follow': '팔로우',
    'following': '팔로잉',
    'followers': '팔로워',
    'posts': '게시물',
    'editProfile': '프로필 편집',
    'bio': '소개',
    
    // Other
    'trendingTopics': '인기 주제',
    'suggestedConnections': '추천 연결',
    'seeAll': '모두 보기',
    'cancel': '취소',
    'save': '저장',
    'delete': '삭제',
    'loading': '로딩 중...',
    'noResults': '결과가 없습니다',
    'error': '오류가 발생했습니다',
    'or': '또는'
  }
};

// i18n hook
export function useTranslation() {
  // Get browser language or default to 'en'
  const getBrowserLanguage = (): SupportedLanguage => {
    const storedLang = localStorage.getItem('language');
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      return storedLang as SupportedLanguage;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return SUPPORTED_LANGUAGES.includes(browserLang) 
      ? browserLang as SupportedLanguage 
      : 'en';
  };
  
  const [language, setLanguage] = useState<SupportedLanguage>(getBrowserLanguage());
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  const changeLanguage = (lang: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      localStorage.setItem('language', lang);
      setLanguage(lang);
    }
  };
  
  return { t, language, changeLanguage };
}
