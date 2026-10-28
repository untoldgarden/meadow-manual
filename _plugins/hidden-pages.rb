# `hidden: true` in a page's front matter keeps the page built (its URL still works) but takes it
# out of the sidebar, the previous/next links, search and the sitemap. Use it for unfinished pages.
Jekyll::Hooks.register :pages, :post_init do |page|
  page.data['sitemap'] = false if page.data['hidden']
end
