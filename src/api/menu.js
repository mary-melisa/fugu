import { createAPI } from '@/utils/http/request';

// 菜品列表查询
export const menuList = data => createAPI('http://39.106.7.166:8011/api/SetMealManagement/VarietyOfDishesDelete', 'post', data);
