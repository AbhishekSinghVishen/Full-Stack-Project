 # Django Imports
from django.shortcuts import render, get_object_or_404, redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import transaction

# Rest Framework Imports
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status,generics
from rest_framework import viewsets
# Local Imports
from base.models import Product,Review
from base.serializers import ProductSerializer




# Get all products 
@api_view(['GET'])
def getProducts(request):
    
    query = request.query_params.get('keyword', '')
    
    products = Product.objects.filter(name__icontains=query).order_by('-_id')

    page = request.query_params.get('page')
    paginator = Paginator(products, 200)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': int(page or 1), 'pages': paginator.num_pages})


# Top Products
@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# Get single product
@api_view(['GET'])
def getProduct(request, pk):
    product = get_object_or_404(Product, _id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


# Create a new product
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    # Ensure data is provided in the request
    if not request.data.get('name') or not request.data.get('price'):
        return Response({"error": "Name and price are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Get the data from the request payload
    user = request.user
    name = request.data.get('name')
    price = request.data.get('price')
    brand = request.data.get('brand', 'Default Brand')  # Optional fields with default values
    countInStock = request.data.get('countInStock', 0)
    category = request.data.get('category', 'Default Category')
    description = request.data.get('description', '')

    # Create the product with the provided data
    product = Product.objects.create(
        user=user,
        name=name,
        price=price,
        brand=brand,
        countInStock=countInStock,
        category=category,
        description=description
    )

    # Serialize and return the created product data
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
# Update a product
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    product = get_object_or_404(Product, _id=pk)
    data = request.data

    product.name = data.get("name", product.name)
    product.price = data.get("price", product.price)  
    product.countInStock = data.get("countInStock", product.countInStock)
    product.description = data.get("description", product.description)

    product.save()

    

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


# Delete a product
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = get_object_or_404(Product, _id=pk)
    product.delete()
    return Response("Product deleted successfully")


# Upload image for a product
@api_view(['POST'])
def uploadImage(request):
    product_id = request.data.get('product_id')
    product = get_object_or_404(Product, _id=product_id)
    product.image = request.FILES.get('image')
    product.save()
    return Response("Image was uploaded")


# Create a product review
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = get_object_or_404(Product, _id=pk)
    data = request.data

    # Check if review already exists
    if product.review_set.filter(user=user).exists():
        return Response({'detail': 'Product already reviewed'}, status=status.HTTP_400_BAD_REQUEST)

    # Check for a rating
    if data.get('rating', 0) == 0:
        return Response({'detail': 'Please select a rating'}, status=status.HTTP_400_BAD_REQUEST)

    # Create a review
    review = Review.objects.create(
        user=user,
        product=product,
        name=user.first_name,
        rating=data['rating'],
        comment=data['comment'],
    )

    reviews = product.review_set.all()
    product.numReviews = reviews.count()
    product.rating = sum([r.rating for r in reviews]) / reviews.count()

    product.save()

    return Response('Review Added')