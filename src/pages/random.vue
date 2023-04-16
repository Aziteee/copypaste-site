<script setup lang="ts">
import { getRandomArticle } from '@/api'
import { useRouter } from 'vue-router'

const router = useRouter()

getRandomArticle().then(response => {
  router.replace({ name: 'article', params: { id: response.data[0].id } })
})
</script>
