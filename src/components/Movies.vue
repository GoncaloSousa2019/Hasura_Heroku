<template>
    <b-container fluid>
        <h1>Movies</h1>
        <b-button @click="initialModal('', titleText='Creating')" v-b-modal.crudByModal class="m-2" variant="primary">Create Movie</b-button>
        <b-list-group>
                <b-row class="m-2 h5 p-2 bg-info">
                    <b-col>Buttons</b-col>
                    <b-col>Title</b-col>
                    <b-col>Release</b-col>
                    <b-col>Director</b-col>
                    <b-col>Composer</b-col>
                </b-row>
            <b-list-group-item
            v-for="(movie,index) in movies" :key="index"
            >
                <b-row>
                    <b-col>
                        <b-button v-b-modal.crudByModal @click="initialModal(movie,titleText='Deleting')" variant="danger" class="mr-3">
                            <b-icon icon="trash"></b-icon>
                        </b-button>
                        <b-button v-b-modal.crudByModal @click="initialModal(movie,titleText='Editing')" variant="warning">
                            <b-icon icon="pencil"></b-icon>
                        </b-button>
                    </b-col>
                    <b-col>{{movie.title}}</b-col>
                    <b-col>{{movie.release_date}}</b-col>
                    <b-col>{{movie.director}}</b-col>
                    <b-col>{{movie.composer}} </b-col>
                </b-row>
            </b-list-group-item>
        </b-list-group>
        <b-modal id="crudByModal" ref="crudByModal" hide-header hide-footer no-close-on-esc no-close-on-backdrop>
            <b-card :title="titleText+' A Movie'">
                <b-form-group class="m-2">
                    Title:<b-form-input type="search" class="m-2" :disabled="formDisabled" v-model="title"></b-form-input>
                    Director:<b-form-input type="search" class="m-2" :disabled="formDisabled" v-model="director"></b-form-input>
                    Composer:<b-form-input type="search" class="m-2" :disabled="formDisabled" v-model="composer"></b-form-input>
                    Release Date:<b-form-datepicker class="m-2" :disabled="formDisabled" v-model="release_date"></b-form-datepicker>
                    <b-button @click="crudFunc('crudByModal')" :disabled="!buttonSave"  :variant="buttonColor" class="m-2">{{buttonText}}</b-button>
                    <b-button @click="hide('crudByModal')" variant="secondary" class="ml-5">Close</b-button>
                </b-form-group>
            </b-card>
        </b-modal>
    </b-container>
</template>

<script>
import gql from 'graphql-tag'

const GET_MOVIES = gql`
    query getMovies {
        movies { id, title, director, composer, release_date}
    }
` 

const SUBSCRIPTION_GET_MOVIES = gql`
    subscription getMovies{
        movies(order_by: {title:asc}){
            id
            title
            director
            composer
            release_date
  }
}
`
const ADD_MOVIE = gql`
    mutation addMovie(
        $title: String!
        $director: String!
        $composer: String
        $release_date: date!
    ) {
        insert_movies(
            objects: [
                {
                    title: $title
                    director: $director
                    composer: $composer
                    release_date: $release_date
                    
                }
            ],
        ) {
            returning {
                id
            }
        }
    }
`

const DELETE_MOVIE = gql`
    mutation deleteMovie (
        $id: uuid!
    ) {
        delete_movies(
            where: {
                id: {
                    _eq: $id
                }
            }
        ) {
            affected_rows
        }
    }
`

const EDIT_MOVIES = gql`
    mutation editMovie (
        $id: uuid!
        $title: String!
        $director: String!
        $composer: String
        $release_date: date!
    ) {
        update_movies(
            where: {
                id: {
                    _eq: $id
                }
            },
            _set: {
                title: $title
                director: $director
                composer: $composer
                release_date: $release_date
            }  
        ) {
            affected_rows
        }
    }

`
export default {
    name:"MoviesC",
    data() {
        return {
            title:"",
            director:"",
            composer:"",
            release_date:"",

            idX:"",
            formDisabled:"",
            buttonText:"",
            buttonColor:"",
            titleText:"",

            movies:[],
        }
    },
    computed: {
        buttonSave(){
            if(!this.title == "" && !this.director == "" && !this.release_date == "" && !this.composer == ""){
                return true
            }
            else return false
        },
    },
    apollo:{
/*         movies:{
            query: GET_MOVIES,
            //pollInterval: 1000, //Faz uma chamada a BD a cada segundo
        },
 */
        $subscribe: {
                movies: {
                    query: SUBSCRIPTION_GET_MOVIES,
                    result(data) {
                        console.log("DATA...........",data)
                        this.movies = data.data.movies
                    }
                }
            }



    },
    methods:{
        crudFunc(modal){
            if(this.titleText == "Deleting") this.erase(modal)
            else if(this.titleText == "Editing") this.edit(modal)
            else this.create(modal)
           
        },
        initialModal(item, crud){
            if(crud != "Deleting"){
                this.formDisabled = false
                this.buttonText = "Save"
                this.buttonColor = "success"
            }
            else{
                this.formDisabled = true
                this.buttonText = "Delete"
                this.buttonColor = "danger"
            }

            this.title = item.title
            this.director = item.director
            this.composer = item.composer
            this.release_date = item.release_date
            this.idX = item.id
        },
        erase(modal){
            let res = this.$apollo.mutate({
                mutation: DELETE_MOVIE,
                variables:{
                    id: this.idX
                },
                refetchQueries: ["getMovies"]
            }).then(res =>{
                console.log("Registo Eliminados com successo com o id: ",res)
                this.hide(modal)
            }).catch(err =>{
                console.log(err)
            })
        },
        edit(modal){
            
            this.$apollo
            .mutate({
                mutation: EDIT_MOVIES,
                variables:{
                    id: this.idX,
                    title: this.title,
                    director: this.director,
                    composer: this.composer,
                    release_date: this.release_date,
                },
                refetchQueries: ["getMovies"] //Atualiza os dados na tabela
            }).then( res => {
                console.log("Registo Editado com successo: ",res)
                this.hide(modal)
            }).catch( err => {
                console.log(err)
            })
            
            
        },
        create(modal){
            this.$apollo
            .mutate({
                mutation: ADD_MOVIE,
                variables: {
                    title: this.title,
                    director: this.director,
                    composer: this.composer,
                    release_date: this.release_date,
                },
                refetchQueries: ["getMovies"]
            }).then(res =>{
                console.log("Registo Criado com successo com o id: ",res.data.insert_movies.returning[0].id)
                this.hide(modal)
            }).catch(err =>{
                console.log(err)
            })

        },
        hide(modal){
            this.$refs[modal].hide();
            this.title = ""
            this.director = ""
            this.composer = ""
            this.release_date = ""
        }
    },

}
</script>