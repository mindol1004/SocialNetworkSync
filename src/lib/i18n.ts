
'use client'

import { useState, useEffect } from 'react';

export const SUPPORTED_LANGUAGES = ['en', 'ko'];
export type SupportedLanguage = 'en' | 'ko';

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
    'email.required': 'Email is required',
    'email.invalid': 'Please enter a valid email',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be at least 6 characters',
    'username.required': 'Username is required',
    'username.minLength': 'Username must be at least 2 characters',
    'terms.required': 'You must agree to the terms',
    'password.notMatch': 'Passwords do not match',
    
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
    'createPost': 'Create Post',
    'whatsOnYourMind': 'What\'s on your mind?',
    'photo': 'Photo',
    'video': 'Video',
    'location': 'Location',
    'postComment': 'Add a comment...',
    'send': 'Send',
    'like': 'Like',
    'comment': 'Comment',
    'share': 'Share',
    'delete': 'Delete',
    'postImage': 'Post image',
    'edit': 'Edit',
    'save': 'Save',
    'cancel': 'Cancel',
    'post': 'Post',
    
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
    'loading': 'Loading...',
    'noResults': 'No results found',
    'error': 'An error occurred',
    'success': 'Success',
    'or': 'or',
    'welcomeBack': 'Welcome back',
    'signInToAccount': 'Sign in to your MiniMeet account',
    'createAccount': 'Create an account',
    'joinToConnect': 'Join MiniMeet to connect with friends and share moments',
    'searchPlaceholder': 'Search posts, people, or tags',
    'exploreTitle': 'Explore',
    'searchResults': 'Search Results',
    'noPostsYet': 'No posts yet. Create your first post!',
    'loadMore': 'Load More',
    'recentActivity': 'Recent Activity',
    'whoToFollow': 'Who to Follow',
    'trending': 'Trending'
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
    'email.required': '이메일을 입력해주세요',
    'email.invalid': '유효한 이메일을 입력해주세요',
    'password.required': '비밀번호를 입력해주세요',
    'password.minLength': '비밀번호는 최소 6자 이상이어야 합니다',
    'username.required': '사용자 이름을 입력해주세요',
    'username.minLength': '사용자 이름은 최소 2자 이상이어야 합니다',
    'terms.required': '약관에 동의해주세요',
    'password.notMatch': '비밀번호가 일치하지 않습니다',
    
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
    'createPost': '게시물 작성',
    'whatsOnYourMind': '무슨 생각을 하고 계신가요?',
    'photo': '사진',
    'video': '동영상',
    'location': '위치',
    'postComment': '댓글 추가...',
    'send': '보내기',
    'like': '좋아요',
    'comment': '댓글',
    'share': '공유하기',
    'delete': '삭제',
    'postImage': '게시물 이미지',
    'edit': '수정',
    'save': '저장',
    'cancel': '취소',
    'post': '게시',
    
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
    'loading': '로딩 중...',
    'noResults': '결과가 없습니다',
    'error': '오류가 발생했습니다',
    'success': '성공',
    'or': '또는',
    'welcomeBack': '다시 오신 것을 환영합니다',
    'signInToAccount': 'MiniMeet 계정으로 로그인하세요',
    'createAccount': '계정 만들기',
    'joinToConnect': '친구들과 소통하고 순간을 공유하세요',
    'searchPlaceholder': '게시물, 사람 또는 태그 검색',
    'exploreTitle': '탐색',
    'searchResults': '검색 결과',
    'noPostsYet': '아직 게시물이 없습니다. 첫 번째 게시물을 작성해보세요!',
    'loadMore': '더 보기',
    'recentActivity': '최근 활동',
    'whoToFollow': '팔로우 추천',
    'trending': '트렌딩'
  }
};

export function useTranslation() {
  const getBrowserLanguage = (): SupportedLanguage => {
    if (typeof window === 'undefined') {
      return 'ko';
    }
    
    try {
      const storedLang = localStorage.getItem('language');
      if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        return storedLang as SupportedLanguage;
      }
      
      const browserLang = navigator.language.split('-')[0];
      return SUPPORTED_LANGUAGES.includes(browserLang) 
        ? browserLang as SupportedLanguage 
        : 'ko';
    } catch (error) {
      return 'ko';
    }
  };
  
  const [language, setLanguage] = useState<SupportedLanguage>('ko');
  
  useEffect(() => {
    setLanguage(getBrowserLanguage());
  }, []);
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  const changeLanguage = (lang: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('language', lang);
        } catch (error) {
          console.error('Failed to save language to localStorage:', error);
        }
      }
      setLanguage(lang);
    }
  };
  
  return { t, language, changeLanguage };
}
