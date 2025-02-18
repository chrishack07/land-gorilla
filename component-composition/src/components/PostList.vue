<template>
   <div class="container">
    <h1 class="title has-text-centered">Lista de Posts</h1>
    
    <!-- Campo de búsqueda -->
    <div class="field">
      <label class="label">Buscar por título</label>
      <div class="control">
        <input 
          v-model="searchQuery" 
          class="input" 
          type="text" 
          placeholder="Buscar..." 
        />
      </div>
    </div>
    
    <!-- Lista de posts -->
    <div v-if="filteredPosts.length" class="box">
      <ul>
        <li v-for="post in currentPagePosts" :key="post.id" class="content">
          <h3 class="title is-5">{{ post.title }}</h3>
          <p>{{ post.body }}</p>
        </li>
      </ul>
    </div>
    
    <!-- Mensaje si no hay posts -->
    <div v-else class="notification is-danger">
      No se encontraron posts.
    </div>
    
    <!-- Paginación -->
    <div class="pagination is-centered">
      <a 
        class="pagination-previous" 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)">
        Anterior
      </a>
      <a 
        class="pagination-next" 
        :disabled="currentPage === totalPages" 
        @click="changePage(currentPage + 1)">
        Siguiente
      </a>
      <ul class="pagination-list">
        <li v-for="page in pagesArray" :key="page">
          <a 
            class="pagination-link" 
            :class="{ 'is-current': page === currentPage }" 
            @click="changePage(page)">
            {{ page }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'PostList',
  setup() {
    const posts = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const postsPerPage = 5;

    // Obtener los datos de la API
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        posts.value = response.data;
      } catch (error) {
        console.error('Error al obtener los posts:', error);
      }
    };

    // Filtrar los posts por la búsqueda
    const filteredPosts = computed(() => {
      return posts.value.filter(post => 
        post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    // Número total de páginas
    const totalPages = computed(() => {
      return Math.ceil(filteredPosts.value.length / postsPerPage);
    });

    // Páginas disponibles
    const pagesArray = computed(() => {
      let pages = [];
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i);
      }
      return pages;
    });

    // Posts para la página actual
    const currentPagePosts = computed(() => {
      const start = (currentPage.value - 1) * postsPerPage;
      const end = start + postsPerPage;
      return filteredPosts.value.slice(start, end);
    });

    // Cambiar de página
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    // Cargar los posts al montar el componente
    onMounted(() => {
      fetchPosts();
    });

    return {
      posts,
      searchQuery,
      filteredPosts,
      currentPage,
      totalPages,
      pagesArray,
      currentPagePosts,
      changePage
    };
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
