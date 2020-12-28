---
title: Dynamic list transitions
description: 'A basic example of a contacts app'
coverImage: 'dynamic-lists.svg'
---

---
## Introduction

When dealing with a list of shared-elements, a few challenges present themselves. This is a guid to some of the common pitfalls you may encounter, and how to solve them.

1. Each element in the list needs a unique namespace.
2. If the list is large enough, performance becomes in issue.


### Unique namespaces

Making use of [Dynamic Directive Arguments](https://vuejs.org/v2/guide/custom-directive.html#Dynamic-Directive-Arguments) takes are of this quite nicely. Let's have a look at the syntax:

```html
<a v-directive:[argument]="..."> ... </a>
```

And here's how we might use that with a `v-shared-element`:


```html
<li
    v-for="person in people"
    :key="person.id"
    v-shared-element:[person.id]
>
    <a :href="`/person/${person.id}`">{{ person.name }}</a>
</li>
```

Great! Now, on `/person/:id`, all we need to do is extract the route parameter and we're good to go:

```html
<h2 v-shared-element:[$route.params.id]>...</h2>
```

Now let's a avatar that is also a shared-element... 

Oh, we only have one piece of data—`person.id`—that is unique. How can we have multiple shared-elements that depend on a single namespace? That's easy, **Namespace All The Things™** ! We're simply going namespace the namespace using template literals. Let's see what that looks like:

```html
<li v-for="person in people" :key="person.id">
    <a :href="`/person/${person.id}`">
        <img v-shared-element:[`avatar-${person.id}`] :src="person.avatar" />

        <h3 v-shared-element:[`name-${person.id}`]>
            {{ person.name }}
        </h3>
    </a>
</li>
```

Excellent! Now we can have multiple shared-elements that derive their namespace from a single source.

### Performance optimizations

Due to the nature of how the vue-router works, v-shared-element must snapshot every shared-element on the current page before the route changes. The full process is as follows: 


1. A link is clicked.
2. `beforeEach` route guard is called and v-shared-element snapshots every shared-element on the current route.
3. The route is updated and the page is loaded.
4. v-shared-element records every shared-element on the *new* route and, if a match is found against the list from the *previous* route, the deltas between the two are calculated and the animation begins.

The "snapshot" step is the real bottleneck here because it requires cloning every element, and their children, and getting the computed-style of each. Even if that element doesn't exist on the next route, and will be discarded, a snapshot is still taken because there is no way to detect which shared-elements will present on the next route.

In order to speed up this process, v-shared-element provides an option called `restrictToRoutes`. It acts as a filter which v-shared-element uses to determine if it needs to snapshot a given element or not. It accepts either an `array` of routes or a `function` that returns `true` if a snapshot should be made for the given element. Let's take a look at both.

#### `restrictToRoutes: string[]`

Providing an array is useful when there is a fixed set of routes or a single route where the shared-element would need a snapshot taken, but not for other routes.

For example, take the logo at the top left of this page is a shared-element. It only needs to be animated when navigating to the home page because it looks the same on every other route. It's markup looks like this:

```html
<img
    src="@/assets/images/logo.png"
    v-shared-element:logo="{
       restrictToRoutes: ['/'],
    }"
/>
```
   
All set! Now this shared-element will be completely ignored unless we're navigating to the home page.

#### `restrictToRoutes: (to, from, id) => boolean`

In a situation such as the Contacts App above, it's only necessary to take snapshots of the shared-elements related to the selected contact. We'll create a **filter function** to determine which elements to snapshot. This function accepts 3 arguments, `to`, `from`, and `namespace`. The first 2 are vue-router [`route` objects](https://router.vuejs.org/api/#the-route-object), and third is the `namespace` of the given shared-element.

Our filter function looks like this:
```js
export default {
    methods: {
        containsRouteId(to, from, namespace) {
            /* 
                Navigating to /person/2
                "avatar-2".includes("2") -> true, snapshot will be taken.

                Navigating to /person/3
                "avatar-2".includes("3") -> false, snapshot will not be taken.
            */
            return namespace.includes(to.params.id)
        }
    }
}
```

Now we can update out list to make use of this new function:


```html
<li v-for="person in people" :key="person.id">
    <a :href="`/person/${person.id}`">
        <img v-shared-element:[`avatar-${person.id}`]="{
            restrictToRoutes: containsRouteId
        }" :src="person.avatar" />

        <h3 v-shared-element:[`name-${person.id}`]="{
            restrictToRoutes: containsRouteId
        }">
            {{ person.name }}
        </h3>
    </a>
</li>
```

Perfect! No matter how long our list is now we only need to snapshot 2 shared-elements.  
If you have any questions, feel free to ask them on [GitHub Discussions!](https://github.com/justintaddei/v-shared-element/discussions)
