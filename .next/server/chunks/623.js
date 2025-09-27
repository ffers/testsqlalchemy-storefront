exports.id=623,exports.ids=[623],exports.modules={37:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var n=r(10335);let a=async e=>[{type:"image/png",sizes:"180x180",url:(0,n.fillMetadataSegment)(".",await e.params,"apple-icon.png")+"?7f22478fd8d4e8e1"}]},2544:(e,t,r)=>{"use strict";r.d(t,{ChannelSelect:()=>s});var n=r(84452),a=r(4234);let s=({channels:e})=>{let t=(0,a.useRouter)(),r=(0,a.useParams)();return(0,n.jsx)("select",{className:"h-10 w-fit rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm  placeholder:text-neutral-500 focus:border-black focus:ring-black",onChange:e=>{let r=e.currentTarget.value;return t.push(`/${r}`)},value:r.channel,children:e.map(e=>(0,n.jsx)("option",{value:e.slug,children:e.currencyCode},e.id))})}},5812:(e,t,r)=>{"use strict";r.r(t),r.d(t,{LinkWithChannel:()=>l});var n=r(84452),a=r(94871),s=r.n(a),i=r(4234);let l=({href:e,...t})=>{let{channel:r}=(0,i.useParams)();if(!e.startsWith("/"))return(0,n.jsx)(s(),{...t,href:e});let a=encodeURIComponent(r??""),l=`/${a}${e}`;return(0,n.jsx)(s(),{...t,href:l})}},5980:(e,t,r)=>{"use strict";r.d(t,{z:()=>s});var n=r(49609),a=r(65019);async function s(e,t){(0,n.V1)("https://jemis.com.ua/graphql/","Missing NEXT_PUBLIC_SALEOR_API_URL env variable");let{variables:r,headers:s,cache:o,revalidate:c,withAuth:u=!0}=t,d={method:"POST",headers:{"Content-Type":"application/json",...s},body:JSON.stringify({query:e.toString(),...r&&{variables:r}}),cache:o,next:{revalidate:c}},m=u?await (await (0,a.j)()).fetchWithAuth("https://jemis.com.ua/graphql/",d):await fetch("https://jemis.com.ua/graphql/",d);if(!m.ok){let e=await (async()=>{try{return await m.text()}catch{return""}})();throw console.error(d.body),new l(m,e)}let h=await m.json();if("errors"in h)throw new i(h);return h.data}class i extends Error{constructor(e){super(e.errors.map(e=>e.message).join("\n")),this.errorResponse=e,this.name=this.constructor.name,Object.setPrototypeOf(this,new.target.prototype)}}class l extends Error{constructor(e,t){super(`HTTP error ${e.status}: ${e.statusText}
${t}`),this.name=this.constructor.name,Object.setPrototypeOf(this,new.target.prototype)}}},8211:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var n=r(84452);function a({error:e,reset:t}){return(0,n.jsx)("div",{className:"bg-white",children:(0,n.jsxs)("div",{className:"mx-auto max-w-7xl px-6 py-12",children:[(0,n.jsx)("h1",{className:"text-2xl font-bold leading-10 tracking-tight text-neutral-800",children:"Something went wrong"}),(0,n.jsx)("p",{className:"mt-6 max-w-2xl text-base leading-7 text-neutral-600",children:(0,n.jsx)("code",{children:e.message})}),(0,n.jsx)("button",{className:"mt-8 h-10 rounded-md bg-red-500 px-6 font-semibold text-white",onClick:()=>t(),children:"Try again"})]})})}r(20157)},8241:(e,t,r)=>{"use strict";r.d(t,{I6:()=>o,KB:()=>l,fC:()=>c,jr:()=>i});var n=r(6958),a=r(61611),s=r(5980);async function i(e){let t=`checkoutId-${e}`;return(await n.UL()).get(t)?.value||""}async function l(e,t){let r="https://jemis.com.ua/".startsWith("https")||!!process.env.NEXT_PUBLIC_VERCEL_URL,a=`checkoutId-${e}`;(await (0,n.UL)()).set(a,t,{sameSite:"lax",secure:r})}async function o(e){try{let{checkout:t}=e?await (0,s.z)(a.Flf,{variables:{id:e},cache:"no-cache"}):{checkout:null};return t}catch{}}async function c({channel:e,checkoutId:t}){return t&&await o(t)||(await u({channel:e})).checkoutCreate?.checkout}let u=({channel:e})=>(0,s.z)(a.oBB,{cache:"no-cache",variables:{channel:e}})},10326:(e,t,r)=>{"use strict";r.d(t,{Logo:()=>n});let n=(0,r(36430).registerClientReference)(function(){throw Error("Attempted to call Logo() from the server but Logo is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/test/Documents/storefront/src/ui/components/Logo.tsx","Logo")},10942:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,86573,23))},12522:(e,t,r)=>{"use strict";r.d(t,{MobileMenu:()=>g});var n=r(84452),a=r(20157),s=r(74367),i=r(89294),l=r(98208),o=r(4234);let c=()=>{let[e,t]=(0,a.useState)(!1),r=(0,o.usePathname)(),n=(0,o.useSearchParams)();return(0,a.useEffect)(()=>{t(!1)},[r,n]),(0,a.useEffect)(()=>{let e=e=>{e.matches&&t(!1)},r=window.matchMedia("(min-width: 768px)");return r.addEventListener("change",e,{passive:!0}),()=>r.removeEventListener("change",e)},[]),{isOpen:e,closeMenu:(0,a.useCallback)(()=>t(!1),[]),openMenu:(0,a.useCallback)(()=>t(!0),[])}};var u=r(16829),d=r(88288);let m=e=>(0,n.jsx)("button",{className:(0,u.A)("flex h-8 w-8 flex-col items-center justify-center gap-1.5 self-end self-center md:hidden"),"aria-controls":e["aria-controls"],"aria-expanded":!1,"aria-label":"Open menu",onClick:e.onClick,children:(0,n.jsx)(d.A,{className:"h-6 w-6 shrink-0","aria-hidden":!0})});var h=r(49527);let p=e=>(0,n.jsx)("button",{className:(0,u.A)("top-0 ml-auto flex h-8 w-8 flex-col items-center justify-center gap-1.5 self-end self-center md:hidden"),"aria-controls":e["aria-controls"],"aria-expanded":!0,"aria-label":"Close menu",onClick:e.onClick,children:(0,n.jsx)(h.A,{className:"h-6 w-6 shrink-0","aria-hidden":!0})}),g=({children:e})=>{let{closeMenu:t,openMenu:r,isOpen:o}=c();return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(m,{onClick:r,"aria-controls":"mobile-menu"}),(0,n.jsx)(s.e,{show:o,children:(0,n.jsx)(i.l,{onClose:t,children:(0,n.jsxs)(i.l.Panel,{className:"fixed inset-0 z-20 flex h-dvh w-screen flex-col overflow-y-scroll",children:[(0,n.jsxs)(s.e.Child,{className:"sticky top-0 z-10 flex h-16 shrink-0 bg-neutral-100/50 px-3 backdrop-blur-md sm:px-8",enter:"motion-safe:transition-all motion-safe:duration-150",enterFrom:"bg-transparent",enterTo:"bg-neutral-100",leave:"motion-safe:transition-all motion-safe:duration-150",leaveFrom:"bg-neutral-100",leaveTo:"bg-transparent",children:[(0,n.jsx)(l.Logo,{}),(0,n.jsx)(p,{onClick:t,"aria-controls":"mobile-menu"})]}),(0,n.jsx)(s.e.Child,{as:a.Fragment,enter:"motion-safe:transition-all motion-safe:duration-150",enterFrom:"opacity-0 -translate-y-3 bg-transparent",enterTo:"opacity-100 translate-y-0 bg-white",leave:"motion-safe:transition-all motion-safe:duration-150",leaveFrom:"opacity-100 translate-y-0 bg-white",leaveTo:"opacity-0 -translate-y-3 bg-transparent",children:(0,n.jsx)("ul",{className:"flex h-full flex-col divide-y divide-neutral-200 whitespace-nowrap p-3 pt-0 sm:p-8 sm:pt-0 [&>li]:py-3",id:"mobile-menu",children:e})})]})})})]})}},12931:(e,t,r)=>{"use strict";r.d(t,{r:()=>s});var n=r(97068);r(92026);var a=r(75364);async function s(){(await (0,a.j)()).signOut()}(0,r(75686).D)([s]),(0,n.A)(s,"00bd4764d810289692c3f8ff98554d704ebd640313",null)},14414:()=>{},22345:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var n=r(10335);let a=async e=>[{type:"image/x-icon",sizes:"48x48",url:(0,n.fillMetadataSegment)(".",await e.params,"favicon.ico")+""}]},23301:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});let n=(0,r(36430).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/test/Documents/storefront/src/app/error.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/test/Documents/storefront/src/app/error.tsx","default")},26556:(e,t,r)=>{Promise.resolve().then(r.bind(r,8211))},28326:()=>{},28896:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,94871,23)),Promise.resolve().then(r.t.bind(r,63338,23)),Promise.resolve().then(r.bind(r,5812)),Promise.resolve().then(r.bind(r,2544)),Promise.resolve().then(r.bind(r,98208)),Promise.resolve().then(r.bind(r,12522)),Promise.resolve().then(r.bind(r,76017)),Promise.resolve().then(r.bind(r,42807))},30181:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i,generateStaticParams:()=>s});var n=r(5980),a=r(61611);let s=async()=>{if(!process.env.SALEOR_APP_TOKEN)return[{channel:"ua"}];{let e=await (0,n.z)(a.WKW,{withAuth:!1,headers:{Authorization:`Bearer ${process.env.SALEOR_APP_TOKEN}`}});return e.channels?.filter(e=>e.isActive).map(e=>({channel:e.slug}))??[]}};function i({children:e}){return e}},37923:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var n=r(10335);let a=async e=>[{type:"image/png",sizes:"512x512",url:(0,n.fillMetadataSegment)(".",await e.params,"icon.png")+"?ecb47051dca2d8c2"}]},38821:(e,t,r)=>{"use strict";r.d(t,{MobileMenu:()=>n});let n=(0,r(36430).registerClientReference)(function(){throw Error("Attempted to call MobileMenu() from the server but MobileMenu is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/test/Documents/storefront/src/ui/components/nav/components/MobileMenu.tsx","MobileMenu")},40124:(e,t,r)=>{Promise.resolve().then(r.bind(r,23301))},42048:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,86573,23)),Promise.resolve().then(r.t.bind(r,63292,23)),Promise.resolve().then(r.bind(r,49302)),Promise.resolve().then(r.bind(r,80778)),Promise.resolve().then(r.bind(r,10326)),Promise.resolve().then(r.bind(r,38821)),Promise.resolve().then(r.bind(r,60887)),Promise.resolve().then(r.bind(r,85039))},42807:(e,t,r)=>{"use strict";r.d(t,{UserMenu:()=>p});var n=r(84452),a=r(20157),s=r(16829),i=r(95285),l=r(74367);let o=({user:e})=>{let t=e.firstName&&e.lastName?`${e.firstName} ${e.lastName}`:null;return(0,n.jsxs)("p",{className:"truncate px-5 py-2 text-xs text-neutral-700",children:[t&&(0,n.jsx)("span",{className:"mb-0.5 block truncate font-bold",children:t}),e.email]})};var c=r(69635);let u=({user:e})=>{let t=e.firstName&&e.lastName?`${e.firstName.slice(0,1)}${e.lastName.slice(0,1)}`:e.email.slice(0,2);return e.avatar?(0,n.jsx)(c.default,{className:"h-8 w-8 rounded-full border","aria-hidden":"true",src:e.avatar.url,width:24,height:24,alt:""}):(0,n.jsx)("span",{className:"flex h-8 w-8 items-center justify-center rounded-full border bg-white text-center text-xs font-bold uppercase","aria-hidden":"true",children:t})};var d=r(26188);let m=(0,d.createServerReference)("00bd4764d810289692c3f8ff98554d704ebd640313",d.callServer,void 0,d.findSourceMapURL,"logout");var h=r(5812);function p({user:e}){return(0,n.jsxs)(i.W,{as:"div",className:"relative",children:[(0,n.jsxs)(i.W.Button,{className:"relative flex rounded-full bg-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800",children:[(0,n.jsx)("span",{className:"sr-only",children:"Open user menu"}),(0,n.jsx)(u,{user:e})]}),(0,n.jsx)(l.e,{as:a.Fragment,enter:"transition ease-out duration-100",enterFrom:"transform opacity-0 scale-95",enterTo:"transform opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"transform opacity-100 scale-100",leaveTo:"transform opacity-0 scale-95",children:(0,n.jsxs)(i.W.Items,{className:"absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-neutral-200 bg-white py-1 text-start shadow ring-1 ring-neutral-200 ring-opacity-5 focus:outline-none",children:[(0,n.jsx)(o,{user:e}),(0,n.jsx)("div",{className:"flex flex-col px-1 py-1",children:(0,n.jsx)(i.W.Item,{children:({active:e})=>(0,n.jsx)(h.LinkWithChannel,{href:"/orders",className:(0,s.A)(e&&"bg-neutral-100","block px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700"),children:"My orders"})})}),(0,n.jsx)("div",{className:"flex flex-col px-1 py-1",children:(0,n.jsx)(i.W.Item,{children:({active:e})=>(0,n.jsx)("form",{action:m,children:(0,n.jsx)("button",{type:"submit",className:(0,s.A)(e&&"bg-neutral-100","block px-4 py-2 text-start text-sm font-medium text-neutral-500 hover:text-neutral-700"),children:"Log Out"})})})})]})})]})}},49302:(e,t,r)=>{"use strict";r.r(t),r.d(t,{LinkWithChannel:()=>n});let n=(0,r(36430).registerClientReference)(function(){throw Error("Attempted to call LinkWithChannel() from the server but LinkWithChannel is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/test/Documents/storefront/src/ui/atoms/LinkWithChannel.tsx","LinkWithChannel")},56273:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var n=r(10335);let a=async e=>[{type:"image/png",width:1200,height:630,url:(0,n.fillMetadataSegment)(".",await e.params,"twitter-image.png")+"?4db0ee8cf66e90af"}]},58946:()=>{},60887:(e,t,r)=>{"use strict";r.d(t,{NavLink:()=>n});let n=(0,r(36430).registerClientReference)(function(){throw Error("Attempted to call NavLink() from the server but NavLink is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/test/Documents/storefront/src/ui/components/nav/components/NavLink.tsx","NavLink")},61611:(e,t,r)=>{"use strict";r.d(t,{AWJ:()=>a,ExP:()=>s,Flf:()=>u,J8U:()=>h,LOP:()=>o,ORr:()=>v,WKW:()=>l,X1f:()=>f,YEp:()=>m,fW8:()=>g,oBB:()=>c,oxT:()=>y,p4O:()=>p,q_7:()=>x,qqm:()=>n,uiG:()=>d,y2Q:()=>b});var n=function(e){return e.Asc="ASC",e.Desc="DESC",e}({}),a=function(e){return e.Cancelled="CANCELLED",e.FullyCharged="FULLY_CHARGED",e.FullyRefunded="FULLY_REFUNDED",e.NotCharged="NOT_CHARGED",e.PartiallyCharged="PARTIALLY_CHARGED",e.PartiallyRefunded="PARTIALLY_REFUNDED",e.Pending="PENDING",e.Refused="REFUSED",e}({}),s=function(e){return e.Collection="COLLECTION",e.CreatedAt="CREATED_AT",e.Date="DATE",e.LastModified="LAST_MODIFIED",e.LastModifiedAt="LAST_MODIFIED_AT",e.MinimalPrice="MINIMAL_PRICE",e.Name="NAME",e.Price="PRICE",e.PublicationDate="PUBLICATION_DATE",e.Published="PUBLISHED",e.PublishedAt="PUBLISHED_AT",e.Rank="RANK",e.Rating="RATING",e.Type="TYPE",e}({});class i extends String{constructor(e,t){super(e),this.value=e,this.__meta__=t}toString(){return this.value}}new i(`
    fragment MenuItem on MenuItem {
  id
  name
  level
  category {
    id
    slug
    name
  }
  collection {
    id
    name
    slug
  }
  page {
    id
    title
    slug
  }
  url
}
    `,{fragmentName:"MenuItem"}),new i(`
    fragment OrderDetails on Order {
  id
  number
  created
  total {
    gross {
      amount
      currency
    }
  }
  lines {
    variant {
      id
      name
      product {
        id
        name
        description
        slug
        thumbnail {
          url
          alt
        }
        category {
          id
          name
        }
      }
      pricing {
        price {
          gross {
            amount
            currency
          }
        }
      }
    }
    quantity
  }
  paymentStatus
}
    `,{fragmentName:"OrderDetails"}),new i(`
    fragment ProductListItem on Product {
  id
  name
  slug
  pricing {
    priceRange {
      start {
        gross {
          amount
          currency
        }
      }
      stop {
        gross {
          amount
          currency
        }
      }
    }
  }
  category {
    id
    name
  }
  thumbnail(size: 1024, format: WEBP) {
    url
    alt
  }
}
    `,{fragmentName:"ProductListItem"}),new i(`
    fragment UserDetails on User {
  id
  email
  firstName
  lastName
  avatar {
    url
    alt
  }
}
    `,{fragmentName:"UserDetails"}),new i(`
    fragment VariantDetails on ProductVariant {
  id
  name
  quantityAvailable
  pricing {
    price {
      gross {
        currency
        amount
      }
    }
  }
}
    `,{fragmentName:"VariantDetails"});let l=new i(`
    query ChannelsList {
  channels {
    id
    name
    slug
    isActive
    currencyCode
    countries {
      country
      code
    }
  }
}
    `),o=new i(`
    mutation CheckoutAddLine($id: ID!, $productVariantId: ID!) {
  checkoutLinesAdd(id: $id, lines: [{quantity: 1, variantId: $productVariantId}]) {
    checkout {
      id
      lines {
        id
        quantity
        variant {
          name
          product {
            name
          }
        }
      }
    }
    errors {
      message
    }
  }
}
    `),c=new i(`
    mutation CheckoutCreate($channel: String!) {
  checkoutCreate(input: {channel: $channel, lines: []}) {
    checkout {
      id
      email
      lines {
        id
        quantity
        totalPrice {
          gross {
            amount
            currency
          }
        }
        variant {
          product {
            id
            name
            slug
            thumbnail {
              url
              alt
            }
            category {
              name
            }
          }
          pricing {
            price {
              gross {
                amount
                currency
              }
            }
          }
          name
          id
        }
      }
      totalPrice {
        gross {
          amount
          currency
        }
      }
    }
    errors {
      field
      code
    }
  }
}
    `);new i(`
    mutation CheckoutDeleteLines($checkoutId: ID!, $lineIds: [ID!]!) {
  checkoutLinesDelete(id: $checkoutId, linesIds: $lineIds) {
    checkout {
      id
    }
    errors {
      field
      code
    }
  }
}
    `);let u=new i(`
    query CheckoutFind($id: ID!) {
  checkout(id: $id) {
    id
    email
    lines {
      id
      quantity
      totalPrice {
        gross {
          amount
          currency
        }
      }
      variant {
        product {
          id
          name
          slug
          thumbnail {
            url
            alt
          }
          category {
            name
          }
        }
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
        name
        id
      }
    }
    totalPrice {
      gross {
        amount
        currency
      }
    }
  }
}
    `),d=new i(`
    query CurrentUser {
  me {
    ...UserDetails
  }
}
    fragment UserDetails on User {
  id
  email
  firstName
  lastName
  avatar {
    url
    alt
  }
}`),m=new i(`
    query CurrentUserOrderList {
  me {
    ...UserDetails
    orders(first: 10) {
      edges {
        node {
          ...OrderDetails
        }
      }
    }
  }
}
    fragment OrderDetails on Order {
  id
  number
  created
  total {
    gross {
      amount
      currency
    }
  }
  lines {
    variant {
      id
      name
      product {
        id
        name
        description
        slug
        thumbnail {
          url
          alt
        }
        category {
          id
          name
        }
      }
      pricing {
        price {
          gross {
            amount
            currency
          }
        }
      }
    }
    quantity
  }
  paymentStatus
}
fragment UserDetails on User {
  id
  email
  firstName
  lastName
  avatar {
    url
    alt
  }
}`),h=new i(`
    query MenuGetBySlug($slug: String!, $channel: String!) {
  menu(slug: $slug, channel: $channel) {
    items {
      ...MenuItem
      children {
        ...MenuItem
      }
    }
  }
}
    fragment MenuItem on MenuItem {
  id
  name
  level
  category {
    id
    slug
    name
  }
  collection {
    id
    name
    slug
  }
  page {
    id
    title
    slug
  }
  url
}`),p=new i(`
    query PageGetBySlug($slug: String!) {
  page(slug: $slug) {
    id
    slug
    title
    seoTitle
    seoDescription
    content
  }
}
    `),g=new i(`
    query ProductDetails($slug: String!, $channel: String!) {
  product(slug: $slug, channel: $channel) {
    id
    name
    slug
    description
    seoTitle
    seoDescription
    thumbnail(size: 1024, format: WEBP) {
      url
      alt
    }
    category {
      id
      name
    }
    variants {
      ...VariantDetails
    }
    pricing {
      priceRange {
        start {
          gross {
            amount
            currency
          }
        }
        stop {
          gross {
            amount
            currency
          }
        }
      }
    }
  }
}
    fragment VariantDetails on ProductVariant {
  id
  name
  quantityAvailable
  pricing {
    price {
      gross {
        currency
        amount
      }
    }
  }
}`),f=new i(`
    query ProductList($first: Int = 9, $channel: String!) {
  products(first: $first, channel: $channel) {
    edges {
      node {
        ...ProductListItem
      }
    }
  }
}
    fragment ProductListItem on Product {
  id
  name
  slug
  pricing {
    priceRange {
      start {
        gross {
          amount
          currency
        }
      }
      stop {
        gross {
          amount
          currency
        }
      }
    }
  }
  category {
    id
    name
  }
  thumbnail(size: 1024, format: WEBP) {
    url
    alt
  }
}`),x=new i(`
    query ProductListByCategory($slug: String!, $channel: String!) {
  category(slug: $slug) {
    name
    description
    seoDescription
    seoTitle
    products(first: 100, channel: $channel) {
      edges {
        node {
          ...ProductListItem
        }
      }
    }
  }
}
    fragment ProductListItem on Product {
  id
  name
  slug
  pricing {
    priceRange {
      start {
        gross {
          amount
          currency
        }
      }
      stop {
        gross {
          amount
          currency
        }
      }
    }
  }
  category {
    id
    name
  }
  thumbnail(size: 1024, format: WEBP) {
    url
    alt
  }
}`),b=new i(`
    query ProductListByCollection($slug: String!, $channel: String!) {
  collection(slug: $slug, channel: $channel) {
    name
    description
    seoDescription
    seoTitle
    products(first: 100) {
      edges {
        node {
          ...ProductListItem
        }
      }
    }
  }
}
    fragment ProductListItem on Product {
  id
  name
  slug
  pricing {
    priceRange {
      start {
        gross {
          amount
          currency
        }
      }
      stop {
        gross {
          amount
          currency
        }
      }
    }
  }
  category {
    id
    name
  }
  thumbnail(size: 1024, format: WEBP) {
    url
    alt
  }
}`),v=new i(`
    query ProductListPaginated($first: Int!, $after: String, $channel: String!) {
  products(first: $first, after: $after, channel: $channel) {
    totalCount
    edges {
      node {
        ...ProductListItem
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    fragment ProductListItem on Product {
  id
  name
  slug
  pricing {
    priceRange {
      start {
        gross {
          amount
          currency
        }
      }
      stop {
        gross {
          amount
          currency
        }
      }
    }
  }
  category {
    id
    name
  }
  thumbnail(size: 1024, format: WEBP) {
    url
    alt
  }
}`),y=new i(`
    query SearchProducts($search: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!, $first: Int!, $after: String, $channel: String!) {
  products(
    first: $first
    after: $after
    channel: $channel
    sortBy: {field: $sortBy, direction: $sortDirection}
    filter: {search: $search}
  ) {
    totalCount
    edges {
      node {
        ...ProductListItem
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    fragment ProductListItem on Product {
  id
  name
  slug
  pricing {
    priceRange {
      start {
        gross {
          amount
          currency
        }
      }
      stop {
        gross {
          amount
          currency
        }
      }
    }
  }
  category {
    id
    name
  }
  thumbnail(size: 1024, format: WEBP) {
    url
    alt
  }
}`)},65019:(e,t,r)=>{"use strict";r.d(t,{H:()=>i,j:()=>o});var n=r(14965),a=r(21276),s=r(49609);let i=12,l="https://jemis.com.ua/graphql/";(0,s.V1)(l,"Missing NEXT_PUBLIC_SALEOR_API_URL env variable");let o=async()=>{let e=await (0,a.R)();return(0,n.w)({saleorApiUrl:l,refreshTokenStorage:e,accessTokenStorage:e})}},65475:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var n=r(10335);let a=async e=>[{type:"image/png",width:1200,height:630,url:(0,n.fillMetadataSegment)(".",await e.params,"opengraph-image.png")+"?4db0ee8cf66e90af"}]},75364:(e,t,r)=>{"use strict";r.d(t,{j:()=>l});var n=r(59447),a=r(81017),s=r(8639);let i="https://jemis.com.ua/graphql/";(0,s.V1)(i,"Missing NEXT_PUBLIC_SALEOR_API_URL env variable");let l=async()=>{let e=await (0,a.R)();return(0,n.w)({saleorApiUrl:i,refreshTokenStorage:e,accessTokenStorage:e})}},76017:(e,t,r)=>{"use strict";r.d(t,{NavLink:()=>o});var n=r(84452),a=r(16829),s=r(5812),i=r(4234);let l=function(){let e=(0,i.usePathname)(),{channel:t}=(0,i.useParams)();return t?e.replace(`/${t}`,""):e};function o({href:e,children:t}){let r=l()===e;return(0,n.jsx)("li",{className:"inline-flex",children:(0,n.jsx)(s.LinkWithChannel,{href:e,className:(0,a.A)(r?"border-neutral-900 text-neutral-900":"border-transparent text-neutral-500","inline-flex items-center border-b-2 pt-px text-sm font-medium hover:text-neutral-700"),children:t})})}},80778:(e,t,r)=>{"use strict";r.d(t,{ChannelSelect:()=>n});let n=(0,r(36430).registerClientReference)(function(){throw Error("Attempted to call ChannelSelect() from the server but ChannelSelect is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/test/Documents/storefront/src/ui/components/ChannelSelect.tsx","ChannelSelect")},85039:(e,t,r)=>{"use strict";r.d(t,{UserMenu:()=>n});let n=(0,r(36430).registerClientReference)(function(){throw Error("Attempted to call UserMenu() from the server but UserMenu is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/test/Documents/storefront/src/ui/components/nav/components/UserMenu/UserMenu.tsx","UserMenu")},85248:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>I,metadata:()=>k});var n=r(78094),a=r(86573),s=r.n(a),i=r(24517),l=r(49302),o=r(80778),c=r(61611),u=r(5980);async function d({channel:e}){let t=await (0,u.z)(c.J8U,{variables:{slug:"footer",channel:e},revalidate:86400}),r=process.env.SALEOR_APP_TOKEN?await (0,u.z)(c.WKW,{withAuth:!1,headers:{Authorization:`Bearer ${process.env.SALEOR_APP_TOKEN}`}}):null,a=new Date().getFullYear();return(0,n.jsx)("footer",{className:"border-neutral-300 bg-neutral-50",children:(0,n.jsxs)("div",{className:"mx-auto max-w-7xl px-4 lg:px-8",children:[(0,n.jsx)("div",{className:"grid grid-cols-3 gap-8 py-16",children:t.menu?.items?.map(e=>n.jsxs("div",{children:[n.jsx("h3",{className:"text-sm font-semibold text-neutral-900",children:e.name}),n.jsx("ul",{className:"mt-4 space-y-4 [&>li]:text-neutral-500",children:e.children?.map(e=>e.category?n.jsx("li",{className:"text-sm",children:n.jsx(l.LinkWithChannel,{href:`/categories/${e.category.slug}`,children:e.category.name})},e.id):e.collection?n.jsx("li",{className:"text-sm",children:n.jsx(l.LinkWithChannel,{href:`/collections/${e.collection.slug}`,children:e.collection.name})},e.id):e.page?n.jsx("li",{className:"text-sm",children:n.jsx(l.LinkWithChannel,{href:`/pages/${e.page.slug}`,children:e.page.title})},e.id):e.url?n.jsx("li",{className:"text-sm",children:n.jsx(l.LinkWithChannel,{href:e.url,children:e.name})},e.id):null)})]},e.id))}),r?.channels&&(0,n.jsx)("div",{className:"mb-4 text-neutral-500",children:(0,n.jsxs)("label",{children:[(0,n.jsx)("span",{className:"text-sm",children:"Change currency:"})," ",(0,n.jsx)(o.ChannelSelect,{channels:r.channels})]})}),(0,n.jsxs)("div",{className:"flex flex-col justify-between border-t border-neutral-200 py-10 sm:flex-row",children:[(0,n.jsxs)("p",{className:"text-sm text-neutral-500",children:["Copyright \xa9 ",a," Jemis, Inc."]}),(0,n.jsxs)("p",{className:"flex gap-1 text-sm text-neutral-500",children:["Powered by"," ",(0,n.jsx)(s(),{target:"_blank",href:"https://asxcrm.com.ua/",children:"ASXCRM"})," ",(0,n.jsx)(s(),{href:"https://github.com/fferses",target:"_blank",className:"opacity-30",children:(0,n.jsx)(i.default,{alt:"Saleor github repository",height:20,width:20,src:"/github-mark.svg"})})]})]})]})})}var m=r(10326),h=r(81919),p=r(5414),g=r(85039);async function f(){let{me:e}=await (0,u.z)(c.uiG,{cache:"no-cache"});return e?(0,n.jsx)(g.UserMenu,{user:e}):(0,n.jsxs)(l.LinkWithChannel,{href:"/login",className:"h-6 w-6 flex-shrink-0",children:[(0,n.jsx)(p.A,{className:"h-6 w-6 shrink-0","aria-hidden":"true"}),(0,n.jsx)("span",{className:"sr-only",children:"Log in"})]})}var x=r(88558),b=r(2343),v=r(8241);let y=async({channel:e})=>{let t=await v.jr(e),r=t?await v.I6(t):null,a=r?r.lines.reduce((e,t)=>e+t.quantity,0):0;return(0,n.jsxs)(l.LinkWithChannel,{href:"/cart",className:"relative flex items-center","data-testid":"CartNavItem",children:[(0,n.jsx)(x.A,{className:"h-6 w-6 shrink-0","aria-hidden":"true"}),a>0?(0,n.jsxs)("div",{className:(0,b.A)("absolute bottom-0 right-0 -mb-2 -mr-2 flex h-4 flex-col items-center justify-center rounded bg-neutral-900 text-xs font-medium text-white",a>9?"w-[3ch]":"w-[2ch]"),children:[a," ",(0,n.jsxs)("span",{className:"sr-only",children:["item",a>1?"s":""," in cart, view bag"]})]}):(0,n.jsx)("span",{className:"sr-only",children:"0 items in cart"})]})};var j=r(60887);let w=async({channel:e})=>{let t=await (0,u.z)(c.J8U,{variables:{slug:"navbar",channel:e},revalidate:86400});return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(j.NavLink,{href:"/products",children:"All"}),t.menu?.items?.map(e=>e.category?n.jsx(j.NavLink,{href:`/categories/${e.category.slug}`,children:e.category.name},e.id):e.collection?n.jsx(j.NavLink,{href:`/collections/${e.collection.slug}`,children:e.collection.name},e.id):e.page?n.jsx(j.NavLink,{href:`/pages/${e.page.slug}`,children:e.page.title},e.id):e.url?n.jsx(s(),{href:e.url,children:e.name},e.id):null)]})};var N=r(38821),P=r(97895);let C=({channel:e})=>(0,n.jsxs)("nav",{className:"flex w-full gap-4 lg:gap-6","aria-label":"Main navigation",children:[(0,n.jsx)("ul",{className:"hidden gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-8 lg:px-0",children:(0,n.jsx)(w,{channel:e})}),(0,n.jsxs)("div",{className:"ml-auto flex items-center justify-center gap-4 whitespace-nowrap lg:gap-8",children:[(0,n.jsx)("div",{className:"hidden lg:flex",children:(0,n.jsx)(P.I,{channel:e})}),(0,n.jsx)(h.Suspense,{fallback:(0,n.jsx)("div",{className:"w-8"}),children:(0,n.jsx)(f,{})})]}),(0,n.jsx)("div",{className:"flex items-center",children:(0,n.jsx)(h.Suspense,{fallback:(0,n.jsx)("div",{className:"w-6"}),children:(0,n.jsx)(y,{channel:e})})}),(0,n.jsx)(h.Suspense,{children:(0,n.jsxs)(N.MobileMenu,{children:[(0,n.jsx)(P.I,{channel:e}),(0,n.jsx)(w,{channel:e})]})})]});function L({channel:e}){return(0,n.jsx)("header",{className:"sticky top-0 z-20 bg-neutral-100/50 backdrop-blur-md",children:(0,n.jsx)("div",{className:"mx-auto max-w-7xl px-3 sm:px-8",children:(0,n.jsxs)("div",{className:"flex h-16 justify-between gap-4 md:gap-8",children:[(0,n.jsx)(m.Logo,{}),(0,n.jsx)(C,{channel:e})]})})})}let k={title:"Saleor Storefront example",description:"Starter pack for building performant e-commerce experiences with Saleor."};async function I(e){let t=(await e.params).channel;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(L,{channel:t}),(0,n.jsxs)("div",{className:"flex min-h-[calc(100dvh-64px)] flex-col",children:[(0,n.jsx)("main",{className:"flex-1",children:e.children}),(0,n.jsx)(d,{channel:t})]})]})}},87466:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>m,metadata:()=>d});var n=r(78094),a=r(84676),s=r.n(a);r(58946);var i=r(81919),l=r(6958),o=r(86573),c=r.n(o);let u=async()=>(await (0,l.rQ)()).isEnabled?(0,n.jsxs)("div",{className:"fixed bottom-0 right-0 z-50 bg-red-100 px-8 py-2 text-red-700",children:["You're in draft mode. Requests are not cached."," ",(0,n.jsx)(c(),{className:"underline",href:"/api/draft/disable",children:"Disable."})]}):null,d={title:"Saleor Storefront example",description:"Starter pack for building performant e-commerce experiences with Saleor.",metadataBase:new URL("https://jemis.com.ua/")};function m(e){let{children:t}=e;return(0,n.jsx)("html",{lang:"en",className:"min-h-dvh",children:(0,n.jsxs)("body",{className:`${s().className} min-h-dvh`,children:[t,(0,n.jsx)(i.Suspense,{children:(0,n.jsx)(u,{})})]})})}},88453:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2707,23)),Promise.resolve().then(r.t.bind(r,90159,23)),Promise.resolve().then(r.t.bind(r,39923,23)),Promise.resolve().then(r.t.bind(r,14018,23)),Promise.resolve().then(r.t.bind(r,88438,23)),Promise.resolve().then(r.t.bind(r,63594,23)),Promise.resolve().then(r.t.bind(r,17304,23)),Promise.resolve().then(r.t.bind(r,70130,23))},93638:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,94871,23))},94533:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,21001,23)),Promise.resolve().then(r.t.bind(r,55697,23)),Promise.resolve().then(r.t.bind(r,96921,23)),Promise.resolve().then(r.t.bind(r,37160,23)),Promise.resolve().then(r.t.bind(r,38104,23)),Promise.resolve().then(r.t.bind(r,2876,23)),Promise.resolve().then(r.t.bind(r,77962,23)),Promise.resolve().then(r.t.bind(r,85996,23))},97895:(e,t,r)=>{"use strict";r.d(t,{I:()=>c,x:()=>o});var n=r(78094),a=r(54051),s=r(46901),i=r(8509),l=r(69745);let o=async function(e,t){var[r]=await (0,s.decryptActionBoundArgs)("6007aac8aec70d6195fa1ab925feb3bdc67f8b28dd",e);let n=t.get("search");n&&n.trim().length>0&&(0,i.redirect)(`/${encodeURIComponent(r)}/search?query=${encodeURIComponent(n)}`)},c=({channel:e})=>{var t=(0,a.A)(o,"6007aac8aec70d6195fa1ab925feb3bdc67f8b28dd",null).bind(null,(0,s.encryptActionBoundArgs)("6007aac8aec70d6195fa1ab925feb3bdc67f8b28dd",e));return(0,n.jsxs)("form",{action:t,className:"group relative my-2 flex w-full items-center justify-items-center text-sm lg:w-80",children:[(0,n.jsxs)("label",{className:"w-full",children:[(0,n.jsx)("span",{className:"sr-only",children:"search for products"}),(0,n.jsx)("input",{type:"text",name:"search",placeholder:"Search for products...",autoComplete:"on",required:!0,className:"h-10 w-full rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"})]}),(0,n.jsx)("div",{className:"absolute inset-y-0 right-0",children:(0,n.jsxs)("button",{type:"submit",className:"inline-flex aspect-square w-10 items-center justify-center text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 group-invalid:pointer-events-none group-invalid:opacity-80",children:[(0,n.jsx)("span",{className:"sr-only",children:"search"}),(0,n.jsx)(l.A,{"aria-hidden":!0,className:"h-5 w-5"})]})})]})}},98208:(e,t,r)=>{"use strict";r.d(t,{Logo:()=>l});var n=r(84452),a=r(4234),s=r(5812);let i="Jemis",l=()=>"/"===(0,a.usePathname)()?(0,n.jsx)("h1",{className:"flex items-center font-bold","aria-label":"homepage",children:i}):(0,n.jsx)("div",{className:"flex items-center font-bold",children:(0,n.jsx)(s.LinkWithChannel,{"aria-label":"homepage",href:"/",children:i})})}};