Vue.component('product', {
    props : {
        premium : {
            type : Boolean,
            required : true
        }
    },
    template : `
    <div class="product">

        <div class="product-image">
            <img v-bind:src="image" >
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <p>Shipping : {{ shipping }}</p>

            <ul>
                <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
            </ul>

            <div v-for="(variant, index) in variants" 
                :key="variant.variantID"
                class="color-box"
                :style="{ backgroundColor : variant.variantColor }"
                @mouseover="updateProductImage(index)">
            </div>

            <button @click="addToCart" 
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to Cart</button>
            
        </div>

        <div>
            <h2>Reviews</h2>
            <p v-if="reviews.length === 0">There are no Reviews Yet</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                    <p>{{ review.name }}</p>
                    <p>{{ review.review }}</p>
                    <p>{{ review.rating }}</p>
                </li>
            </ul>
        </div>

        <product-review @review-submitted="addReview"></product-review>
        
    </div>
    `,
    data() {
        return {
            brand : 'Vue Mastery',
            product : 'Socks',
            selectedVariant : 0,
            details : ["80% Cotton", "20% polyster", "Gender Neutral"],
            variants : [
                {
                    variantID : 2234,
                    variantColor : "green",
                    variantImage : "./img/socks-green.jpg",
                    variantQuantity : 10
                },
                {
                    variantID : 2235,
                    variantColor : "blue",
                    variantImage : "./img/socks-blue.jpg",
                    variantQuantity : 0
                }
            ],
            reviews : []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID);
            // this.cart ++;
        },
        updateProductImage(index){
            this.selectedVariant = index;
        },
        addReview(productReview){
            this.reviews.push(productReview);
        }
    },
    computed: {
        title() {
            return this.brand +' '+ this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity            
        },
        shipping() {
            return (this.premium)?"Free":"$ 2.99";
        }
    },
});

Vue.component('product-review', {
    template : 
    `
    <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Please Correct the following error(s)</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
            
        <p>
            <input type="submit" value="Submit">  
        </p>    
    
    </form>
    `,
    data() {
        return {
            name : null,
            review : null,
            rating : null,
            errors : []
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if(this.name && this.review && this.rating){
                let productReview = {
                    name : this.name,
                    review : this.review,
                    rating : this.rating,
                };
                this.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null; 
                this.rating = null;
            }
            else
            {
                if(!this.name) this.errors.push("Name is Required")
                if(!this.review) this.errors.push("Review is Required")
                if(!this.rating) this.errors.push("Rating is Required")
            }
            
        }
    },
});

var app = new Vue({
    el : '#app',
    data : {
        premium : true,
        cart : []
    },
    methods : {
        updateCart(id) {
            this.cart.push(id)
        },
    }
})