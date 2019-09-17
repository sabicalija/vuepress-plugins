export interface ExtraPage {
  /**
   * permalink of page
   */
  permalink: string;

  /**
   * frontmatter of page
   */
  frontmatter?: Record<string, any>;

  /**
   * meta data of page
   */
  meta?: Record<string, any>;
}

export interface IndexPage extends ExtraPage {
  /**
   * frontmatter of page
   */
  frontmatter: Record<string, any>;
}
