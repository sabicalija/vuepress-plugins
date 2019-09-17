export interface PageEnhancer {
  /**
   * Conditions for enhancer execution
   */
  when($page: any): boolean;

  /**
   * frontmatter injected to matched pages
   */
  frontmatter: Record<string, any>;
  /**
   * Extra data injected to `$page` object
   */
  data?: Record<string, any>;
}
