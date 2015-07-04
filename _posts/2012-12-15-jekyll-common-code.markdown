---
layout: post
category: "network"
title:  "Jekyll常用列表，标签代码"
tags: [Jekyll,列表,标签,代码]
---
<% highlight html %>
<h1>分类(Categorys)</h1>
	{% for category in site.categories %}
				<a href="/categories.html#{{ category[0] }}">
				{% if page.categories contains category[0] %}
				<b>{{ category[0] }}</b>
				{% else %}
					{{ category[0] }}
				{% endif %}
				</a>
				<sup>[{{ category[1].size }}]</sup>
			, 
	{% endfor %}

分类显示列表
<div id="home">
	{% for cat in site.categories %}
	{% if cat[0] != 'blog' %}
	<a name="{{ cat[0] }}"><h3>{{ cat[0] }}({{ cat[1].size }})</h3></a>
		{% for f in cat[1] %}
		 <p>{{ f.date | date: "%Y-%m-%d" }} <a href="{{ f.url }}">{{ f.title }}</a></p>
		{% endfor %}
	{% endif %}
	{% endfor %}
</div>
<% endhighlight %>

<% highlight html %>
<h1>标签(Tags)</h1>		
	{% for tag in site.tags %}
				<a href="/tags.html#{{ tag[0] }}">
				{% if page.tags contains tag[0] %}
					<b>{{tag[0]}}</b>
				{% else %}
					{{ tag[0] }}
				{% endif %}
				</a>
				<sup>[{{ tag[1].size }}]</sup>
			,
	{% endfor %}
<% endhighlight %>

<% highlight html %>
<h1>Recent Posts</h1>
  <ul class="posts">
    {% for post in site.posts limit:10 %}
    <li><span>{{ post.date | date_to_string }}</span>&raquo;<a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
</ul>
<% endhighlight %>

<% highlight html %>
分页显示
<!-- This loops through the paginated posts -->
{% for post in paginator.posts %}
  <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
  <p class="author">
    <span class="date">{{ post.date | date: "%Y-%m-%d" }}</span>
  </p>
  <div class="content">
    {{ post.content }}
  </div>
{% endfor %}
<div style="height:16px"></div>

<!-- Pagination links -->
<div class="pagination">
  {% if paginator.previous_page %}
    {% if paginator.previous_page == 1 %}
        <a href="/" class="previous">Previous</a>
      {% else %}
        <a href="/page{{ paginator.previous_page }}" class="previous">Previous</a>
    {% endif %}
  {% else %}
    <span class="previous">Previous</span>
  {% endif %}
  <span class="page_number ">Page: {{ paginator.page }} of {{ paginator.total_pages }}</span>
  {% if paginator.next_page %}
    <a href="/page{{ paginator.next_page }}" class="next">Next</a>
  {% else %}
    <span class="next ">Next</span>
  {% endif %}
</div>
<% endhighlight %>